import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Hls from 'hls.js';
import { useViewerTracking } from '@/hooks/useViewerTracking';


interface VideoPlayerProps {
  streamUrl: string;
  isLive: boolean;
  title: string;
}

export default function VideoPlayer({ streamUrl, isLive, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canRewind, setCanRewind] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamStartTime, setStreamStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Track real-time viewers
  useViewerTracking({ streamType: 'tv', isPlaying });
  
  // Program start time for Oroma TV (6:00 AM daily)
  const getProgramStartTime = () => {
    const now = new Date();
    const programStart = new Date();
    programStart.setHours(6, 0, 0, 0); // 6:00 AM today
    
    // If it's before 6 AM, use yesterday's 6 AM
    if (now.getHours() < 6) {
      programStart.setDate(programStart.getDate() - 1);
    }
    
    return programStart;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initializePlayer = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          manifestLoadingTimeOut: 30000,
          manifestLoadingMaxRetry: 5,
          manifestLoadingRetryDelay: 1000,
          levelLoadingTimeOut: 30000,
          levelLoadingMaxRetry: 5,
          fragLoadingTimeOut: 30000,
          fragLoadingMaxRetry: 5,
          xhrSetup: function(xhr, url) {
            xhr.withCredentials = false;
            xhr.timeout = 30000;
          }
        });
        
        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed');
          setIsLoading(false);
          setError(null);
          if (isLive && !streamStartTime) {
            setStreamStartTime(getProgramStartTime());
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            setError('Stream connection error - attempting to reconnect...');
            // Destroy and recreate HLS instance
            setTimeout(() => {
              if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
              }
              // Reinitialize after 3 seconds
              setTimeout(initializePlayer, 3000);
            }, 1000);
          }
        });

        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          setIsBuffering(false);
        });

        hls.on(Hls.Events.BUFFER_APPENDING, () => {
          setIsBuffering(false);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl;
        setIsLoading(false);
        setError(null);
        if (isLive && !streamStartTime) {
          setStreamStartTime(new Date());
        }
      } else {
        // Fallback: try direct video loading as MP4
        console.log('HLS not supported, using fallback');
        video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        setIsLoading(false);
        setError(null);
        if (isLive && !streamStartTime) {
          setStreamStartTime(new Date());
        }
      }
    };

    initializePlayer();

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError('Failed to load video stream');

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('durationchange', updateDuration);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);

      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  // Update elapsed time for live streams
  useEffect(() => {
    if (!isLive || !streamStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - streamStartTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, streamStartTime]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (err) {
      console.error('Error playing video:', err);
      setError('Failed to play video');
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume / 100;
    setVolume([newVolume]);
    
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
        
        // Lock orientation to landscape on mobile
        if ('orientation' in screen && 'lock' in (screen as any).orientation && /Mobi|Android/i.test(navigator.userAgent)) {
          try {
            await (screen as any).orientation.lock('landscape');
          } catch (orientationError) {
            console.log('Orientation lock failed:', orientationError);
          }
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        
        // Unlock orientation
        if ('orientation' in screen && 'unlock' in (screen as any).orientation) {
          (screen as any).orientation.unlock();
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
  };

  const rewindToLive = () => {
    const video = videoRef.current;
    if (!video || !isLive) return;

    video.currentTime = video.duration;
    setCanRewind(false);
  };

  const jumpToLive = () => {
    const video = videoRef.current;
    if (!video || !isLive) return;

    video.currentTime = video.duration;
    setCanRewind(false);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const retryStream = () => {
    setError(null);
    setIsLoading(true);
    
    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    // Force a re-render by updating the component
    const video = videoRef.current;
    if (video) {
      window.location.reload();
    }
  };

  if (error) {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <div className="absolute inset-0 flex items-center justify-center text-white p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Stream Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={retryStream} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full aspect-video"
        autoPlay
        muted={isMuted}
        playsInline
        controls={false}
      />

      {/* Loading Overlay */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>{isLoading ? 'Loading stream...' : 'Buffering...'}</p>
          </div>
        </div>
      )}





      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        {!isLive && duration > 0 && (
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => seekTo(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Live Progress Bar with Elapsed Time */}
        {isLive && (
          <div className="mb-4">
            <div className="relative">
              {/* Progress track */}
              <div className="w-full h-1 bg-white/20 rounded-full relative">
                {/* Elapsed time progress */}
                <div 
                  className="h-full bg-red-600 rounded-full relative"
                  style={{ width: '100%' }}
                >
                  {/* Red dot at the end for live edge */}
                  <button
                    onClick={jumpToLive}
                    className="absolute -right-1 -top-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Jump to Live"
                  />
                </div>
              </div>
            </div>
            {/* Elapsed time display */}
            <div className="flex justify-between text-xs text-white mt-1">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                LIVE - {formatTime(elapsedTime)} elapsed
              </span>
              <span className="text-red-400">• LIVE</span>
            </div>
          </div>
        )}

        {/* DVR Controls for Live */}
        {isLive && canRewind && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={rewindToLive}
                className="text-white hover:text-red-600"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Back to Live
              </Button>
            </div>
            <div className="text-xs text-red-400">
              Watching {Math.floor((duration - currentTime) / 60)}m behind live
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:text-red-600 p-2"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:text-red-600 p-2"
              >
                {isMuted || volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-white text-sm font-medium">
              {title}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-600 p-2"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:text-red-600 p-2"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}