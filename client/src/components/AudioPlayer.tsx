import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Share, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { useViewerTracking } from '@/hooks/useViewerTracking';


interface AudioPlayerProps {
  streamUrl: string;
  title: string;
  frequency: string;
  artworkUrl?: string;
  onShare?: () => void;
}

export default function AudioPlayer({ streamUrl, title, frequency, artworkUrl, onShare }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track real-time listeners
  useViewerTracking({ streamType: 'radio', isPlaying });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      setError('QFM Radio 94.3 stream connecting...');
      setIsLoading(false);
      // Retry after 5 seconds
      setTimeout(() => {
        setError(null);
        const audio = audioRef.current;
        if (audio) {
          audio.load();
        }
      }, 5000);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
      setError('Audio playback failed - click to retry');
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume / 100;
    setVolume([newVolume]);
    
    if (newVolume === 0) {
      setIsMuted(true);
      audio.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  return (
    <div className="space-y-4">
      {/* Modern Radio Player */}
      <Card className="p-8 bg-gradient-to-br from-red-600 to-red-800 text-white border-none shadow-xl">
        <audio ref={audioRef} src={streamUrl} />
        
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            {artworkUrl ? (
              <img 
                src={artworkUrl} 
                alt={title}
                className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto"
              />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Radio className="h-16 w-16 text-white" />
              </div>
            )}
            
            {/* Live indicator */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
              LIVE
            </div>
          </div>

          <h3 className="font-bold text-2xl mb-1">{title}</h3>
          <p className="text-red-100 font-medium text-lg">FM {frequency}</p>
          <p className="text-red-200 text-sm">Northern Uganda's Funkiest Radio Station</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-center mb-4 p-3 bg-red-500/20 rounded-lg">
            <p className="text-sm">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setError(null);
                const audio = audioRef.current;
                if (audio) {
                  audio.load();
                }
              }}
              className="mt-2 text-white border-white/20"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          {/* Loading/Buffering */}
          {(isLoading || isBuffering) && !error && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          )}

          {/* Play/Pause */}
          <Button
            onClick={togglePlay}
            size="lg"
            className="rounded-full w-20 h-20 bg-white text-red-600 hover:bg-red-50 shadow-lg transform hover:scale-105 transition-all"
            disabled={isLoading}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/10 rounded-full p-3"
            >
              {isMuted || volume[0] === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <div className="w-24">
              <Slider
                value={volume}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="text-center space-y-3">
          {onShare && (
            <Button
              onClick={onShare}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-lg"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Radio
            </Button>
          )}
        </div>
      </Card>

      {/* Radio Info Card */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <div className="text-center">
          <h4 className="font-semibold text-red-800 mb-2">Now Playing</h4>
          <p className="text-red-700">Continuous music and entertainment</p>
          <p className="text-red-600 text-sm mt-1">Broadcasting 24/7 from Lira, Uganda</p>
        </div>
      </Card>
    </div>
  );
}