import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LocationServiceProps {
  onLocationUpdate: (location: { lat: number; lng: number } | null) => void;
}

interface Place {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setLocation(newLocation);
        onLocationUpdate(newLocation);

        const mockAddress = `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`;
        setAddress(mockAddress);

        setIsLoading(false);
        toast({
          title: "Location Updated",
          description: "Your current location has been captured",
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyPlaces = async () => {
    if (!location) return;
    const placesURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=3000&type=hospital|police&key=AIzaSyB4if5Ir7Gxea1nnxnQG3uIrkGkv9cIV9I`;

    try {
      const response = await fetch(placesURL);
      const data = await response.json();
      setNearbyPlaces(data.results);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const initializeMap = () => {
    if (!location || !mapRef.current || !(window as any).google) return;
    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
    });

    new (window as any).google.maps.Marker({
      position: location,
      map,
      title: "Your Location",
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    nearbyPlaces.forEach((place) => {
      new (window as any).google.maps.Marker({
        position: place.geometry.location,
        map,
        title: place.name,
      });
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) fetchNearbyPlaces();
  }, [location]);

  useEffect(() => {
    initializeMap();
  }, [location, nearbyPlaces]);

  const openInMaps = () => {
    if (location) {
      const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const shareLocation = () => {
    if (location) {
      const locationText = `My current location: https://maps.google.com/?q=${location.lat},${location.lng}`;

      if (navigator.share) {
        navigator.share({ title: 'My Location - SafeSister', text: locationText });
      } else {
        navigator.clipboard.writeText(locationText).then(() => {
          toast({ title: "Location Copied", description: "Location link copied to clipboard" });
        });
      }
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="text-purple-700 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Service
          </div>
          <Button onClick={getCurrentLocation} disabled={isLoading} size="sm" variant="outline" className="border-purple-200 hover:bg-purple-50">
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <Button onClick={getCurrentLocation} size="sm" variant="outline">Try Again</Button>
          </div>
        ) : location ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center text-green-700 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="font-semibold">Location Captured</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Latitude: {location.lat.toFixed(6)}</div>
                <div>Longitude: {location.lng.toFixed(6)}</div>
                {address && <div>Address: {address}</div>}
              </div>
            </div>

            <div ref={mapRef} className="w-full h-64 border rounded-lg" />

            <div className="flex space-x-2">
              <Button onClick={openInMaps} size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <ExternalLink className="w-4 h-4 mr-1" />
                View in Maps
              </Button>
              <Button onClick={shareLocation} size="sm" variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50">
                Share Location
              </Button>
            </div>

            {nearbyPlaces.length > 0 && (
              <div className="mt-4 bg-white border border-purple-100 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-purple-700 mb-2">Nearby Hospitals & Police Stations</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {nearbyPlaces.map((place, index) => (
                    <li key={index} className="border-b pb-1">
                      <div className="font-medium">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.vicinity || "No address"}</div>
                      <div className="text-xs text-blue-500">
                        Distance: {calculateDistance(location.lat, location.lng, place.geometry.location.lat, place.geometry.location.lng).toFixed(2)} km
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <div>Getting your location...</div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <strong>Privacy Note:</strong> Your location is only used for emergency alerts and is not stored on our servers.
          Location access can be revoked at any time in your browser settings.
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationService;
