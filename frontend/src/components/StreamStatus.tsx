import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

interface StreamStatusProps {
  streamType: 'tv' | 'radio';
  streamUrl: string;
}

export function StreamStatus({ streamType, streamUrl }: StreamStatusProps) {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Simulate stream status check
    const checkStreamStatus = () => {
      // For demo purposes, show as online with good quality
      setStatus('online');
      setQuality(streamType === 'tv' ? 'high' : 'medium');
    };

    checkStreamStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStreamStatus, 30000);
    return () => clearInterval(interval);
  }, [streamUrl, streamType]);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'checking': return 'bg-yellow-500';
    }
  };

  const getQualityColor = () => {
    switch (quality) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
    }
  };

  return (
    <Card className="p-3 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'online' ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-medium text-white">
            {streamType === 'tv' ? 'TV Stream' : 'Radio Stream'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant="secondary" 
            className={`text-xs ${getQualityColor()} bg-white/20 border-white/30`}
          >
            {quality.toUpperCase()}
          </Badge>
          
          {status === 'online' ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : status === 'offline' ? (
            <WifiOff className="w-4 h-4 text-red-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-400 animate-spin" />
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-white/80">
        {status === 'online' && (
          <>
            <div className="flex justify-between">
              <span>Bitrate:</span>
              <span>{streamType === 'tv' ? '1080p HD' : '128 kbps'}</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span>Low (~2s)</span>
            </div>
          </>
        )}
        {status === 'offline' && (
          <span className="text-red-300">Stream temporarily offline</span>
        )}
        {status === 'checking' && (
          <span className="text-yellow-300">Checking stream status...</span>
        )}
      </div>
    </Card>
  );
}