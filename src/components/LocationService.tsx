
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LocationServiceProps {
  onLocationUpdate: (location: { lat: number; lng: number } | null) => void;
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
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
        
        // Try to get address from coordinates (reverse geocoding)
        try {
          // In a real app, you would use a geocoding service like Google Maps API
          // For this demo, we'll create a mock address
          const mockAddress = `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`;
          setAddress(mockAddress);
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        }
        
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
        navigator.share({
          title: 'My Location - SafeSister',
          text: locationText,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(locationText).then(() => {
          toast({
            title: "Location Copied",
            description: "Location link copied to clipboard",
          });
        });
      }
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="text-purple-700 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Service
          </div>
          <Button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="border-purple-200 hover:bg-purple-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <Button onClick={getCurrentLocation} size="sm" variant="outline">
              Try Again
            </Button>
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
            
            <div className="flex space-x-2">
              <Button 
                onClick={openInMaps}
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View in Maps
              </Button>
              <Button 
                onClick={shareLocation}
                size="sm"
                variant="outline"
                className="flex-1 border-purple-200 hover:bg-purple-50"
              >
                Share Location
              </Button>
            </div>
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
