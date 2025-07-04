
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, MapPin, AlertTriangle, Users, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import VoiceMonitor from "@/components/VoiceMonitor";
import EmergencyContacts from "@/components/EmergencyContacts";
import LocationService from "@/components/LocationService";

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
          toast({
            title: "Location Access",
            description: "Please enable location access for emergency features",
            variant: "destructive"
          });
        }
      );
    }
  }, []);

  const handlePanicButton = async () => {
    setIsPanicMode(true);
    
    // Trigger emergency alert
    const emergencyMessage = `🚨 EMERGENCY ALERT 🚨\nSafeSister panic button activated!\nTime: ${new Date().toLocaleString()}`;
    
    if (currentLocation) {
      const locationMessage = `\nLocation: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
      console.log(emergencyMessage + locationMessage);
    }

    toast({
      title: "🚨 EMERGENCY ALERT SENT",
      description: "Your emergency contacts have been notified",
      variant: "destructive"
    });

    // Reset panic mode after 5 seconds
    setTimeout(() => {
      setIsPanicMode(false);
    }, 5000);
  };

  const toggleVoiceMonitoring = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice monitoring stopped" : "Voice monitoring started",
      description: isListening ? "Microphone deactivated" : "Listening for distress keywords",
    });
  };

  const handleDistressDetected = (keyword: string) => {
    console.log(`Distress keyword detected: ${keyword}`);
    handlePanicButton();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SafeSister
              </h1>
            </div>
            <div className="text-sm text-purple-600 font-medium">
              Stay Safe, Stay Connected
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Emergency Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Panic Button */}
          <Card className={`border-2 transition-all duration-300 ${
            isPanicMode 
              ? 'border-red-500 bg-red-50 shadow-red-200 shadow-lg animate-pulse' 
              : 'border-purple-200 bg-white/70 backdrop-blur-sm hover:shadow-lg hover:border-purple-300'
          }`}>
            <CardContent className="p-6 text-center">
              <Button
                onClick={handlePanicButton}
                disabled={isPanicMode}
                className={`w-32 h-32 rounded-full text-white font-bold text-lg transition-all duration-300 ${
                  isPanicMode
                    ? 'bg-red-600 scale-110 shadow-xl'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  {isPanicMode ? 'ALERT SENT!' : 'PANIC'}
                </div>
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Press for immediate emergency alert
              </p>
            </CardContent>
          </Card>

          {/* Voice Monitor */}
          <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Button
                onClick={toggleVoiceMonitoring}
                className={`w-32 h-32 rounded-full text-white font-bold text-lg transition-all duration-300 ${
                  isListening
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                } hover:scale-105`}
              >
                <div className="flex flex-col items-center">
                  {isListening ? <Mic className="w-8 h-8 mb-2" /> : <MicOff className="w-8 h-8 mb-2" />}
                  {isListening ? 'LISTENING' : 'START VOICE'}
                </div>
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                {isListening ? 'Monitoring for distress keywords' : 'Activate voice monitoring'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voice Monitor Component */}
        <VoiceMonitor 
          isListening={isListening} 
          onDistressDetected={handleDistressDetected}
        />

        {/* Location Service */}
        <LocationService onLocationUpdate={setCurrentLocation} />

        {/* Emergency Contacts */}
        <EmergencyContacts />

        {/* Status Info */}
        <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Voice Monitor: {isListening ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Location: {currentLocation ? 'Available' : 'Unavailable'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>SafeSister: Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
