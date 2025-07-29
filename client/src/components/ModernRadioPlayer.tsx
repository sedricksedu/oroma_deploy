import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

const qfmLogoPath = "/oromatv-logo.png";


interface ModernRadioPlayerProps {
  streamUrl: string;
  title: string;
  frequency: string;
  artworkUrl?: string;
  onShare?: () => void;
}

export default function ModernRadioPlayer({ 
  streamUrl, 
  title, 
  frequency, 
  artworkUrl, 
  onShare 
}: ModernRadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Now Playing");

  // Audio visualizer bars simulation
  const [visualizerBars, setVisualizerBars] = useState(Array(12).fill(0));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Animate visualizer bars when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isBuffering) {
      interval = setInterval(() => {
        setVisualizerBars(bars => 
          bars.map(() => Math.random() * 100)
        );
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isBuffering]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Audio play error:', error);
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
      {/* Modern Dark Radio Player */}
      <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-none shadow-2xl overflow-hidden h-80 md:h-auto">
        <audio ref={audioRef} src={streamUrl} />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)] pointer-events-none" />
        
        <div className="relative p-4 md:p-8 h-full flex flex-col justify-center">
          {/* Header with Station Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
                <Radio className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-red-400 text-sm">FM {frequency}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-xs font-medium">LIVE</span>
            </div>
          </div>

          {/* Album Art Section - QFM Logo */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border-4 border-red-700">
                <img 
                  src={qfmLogoPath} 
                  alt="QFM Radio 94.3"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
              </div>
              
              {/* Pulsing Ring Effect */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border-4 border-red-500 animate-ping opacity-20" />
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-1">Northern Uganda's Funkiest Station</h4>
            <p className="text-gray-400 text-sm">{currentTrack}</p>
          </div>

          {/* Audio Visualizer */}
          <div className="flex items-end justify-center space-x-1 mb-6 h-20">
            {visualizerBars.map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-red-800 to-red-600 rounded-full transition-all duration-150 ease-in-out"
                style={{
                  width: '4px',
                  height: isPlaying ? `${Math.max(height, 10)}%` : '10%',
                  opacity: isPlaying ? 1 : 0.3
                }}
              />
            ))}
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 rounded-full p-4"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              onClick={togglePlay}
              size="lg"
              className="w-16 h-16 rounded-full bg-red-700 hover:bg-red-800 shadow-2xl transform hover:scale-105 transition-all"
              disabled={isLoading}
            >
              {isLoading || isBuffering ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 rounded-full p-4"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          {/* Volume and Additional Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/10 rounded-full p-2"
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
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

            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1" />
                24/7 Live
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-600 to-red-800" />
      </Card>

      {/* Radio Info Card */}
      <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <div className="text-center">
          <h4 className="font-semibold text-red-800 mb-2">Now Broadcasting</h4>
          <p className="text-red-700">Continuous music and entertainment from Lira, Uganda</p>
          <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-red-600">
            <span>📻 FM {frequency}</span>
            <span>🌍 Lira City</span>
            <span>📞 0777676206</span>
          </div>
        </div>
      </Card>
    </div>
  );
}