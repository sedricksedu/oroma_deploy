import { useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface UseViewerTrackingProps {
  streamType: 'tv' | 'radio';
  isPlaying: boolean;
}

export function useViewerTracking({ streamType, isPlaying }: UseViewerTrackingProps) {
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const hasJoined = useRef(false);

  // Join stream when starting to watch
  useEffect(() => {
    if (isPlaying && !hasJoined.current) {
      joinStream();
      hasJoined.current = true;
    }
  }, [isPlaying, streamType]);

  // Leave stream when component unmounts or stops playing
  useEffect(() => {
    return () => {
      if (hasJoined.current) {
        leaveStream();
        hasJoined.current = false;
      }
    };
  }, [streamType]);

  // Start/stop heartbeat based on playing state
  useEffect(() => {
    if (isPlaying && hasJoined.current) {
      startHeartbeat();
    } else {
      stopHeartbeat();
    }

    return () => stopHeartbeat();
  }, [isPlaying, streamType]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasJoined.current) {
        leaveStream();
        hasJoined.current = false;
      } else if (!document.hidden && isPlaying && !hasJoined.current) {
        joinStream();
        hasJoined.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, streamType]);

  const joinStream = async () => {
    try {
      await apiRequest('POST', '/api/active-users/join', { streamType });
    } catch (error) {
      console.error('Failed to join stream:', error);
    }
  };

  const leaveStream = async () => {
    try {
      await apiRequest('POST', '/api/active-users/leave', { streamType });
    } catch (error) {
      console.error('Failed to leave stream:', error);
    }
  };

  const sendHeartbeat = async () => {
    try {
      await apiRequest('POST', '/api/active-users/heartbeat', { streamType });
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
    }
  };

  const startHeartbeat = () => {
    stopHeartbeat(); // Clear any existing interval
    heartbeatInterval.current = setInterval(sendHeartbeat, 30000); // Every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };
}