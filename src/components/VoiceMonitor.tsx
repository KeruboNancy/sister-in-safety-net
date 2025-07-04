
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mic } from 'lucide-react';

interface VoiceMonitorProps {
  isListening: boolean;
  onDistressDetected: (keyword: string) => void;
}

const VoiceMonitor: React.FC<VoiceMonitorProps> = ({ isListening, onDistressDetected }) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  // Distress keywords to monitor
  const distressKeywords = [
    'help', 'emergency', 'danger', 'attack', 'scared', 'police', 
    'ambulance', 'fire', 'hurt', 'pain', 'stop', 'no', 'afraid',
    'kidnap', 'robbery', 'theft', 'assault', 'harassment'
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      setIsSupported(false);
      console.log('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
        
        // Check for distress keywords in real-time
        distressKeywords.forEach(keyword => {
          if (transcript.includes(keyword)) {
            console.log(`Distress keyword detected: ${keyword}`);
            onDistressDetected(keyword);
          }
        });
      }
      
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if still listening
      }
    };

    setRecognition(recognition);

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recognition || !isSupported) return;

    if (isListening) {
      setTranscript('');
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [isListening, recognition, isSupported]);

  if (!isSupported) {
    return (
      <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Voice recognition not supported in this browser. Please use Chrome or Safari.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="text-purple-700 flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Voice Monitor
          {isListening && <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <strong>Monitoring Keywords:</strong> {distressKeywords.join(', ')}
          </div>
          
          {isListening && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Live Transcript:</div>
              <div className="text-sm font-mono">
                {transcript || 'Listening...'}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Voice monitoring uses your browser's speech recognition. 
            Distress keywords will automatically trigger emergency alerts.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceMonitor;
