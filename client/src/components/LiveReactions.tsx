import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const reactions = [
  { emoji: '❤️', name: 'heart', color: 'text-red-500' },
  { emoji: '👍', name: 'thumbsup', color: 'text-blue-500' },
  { emoji: '😊', name: 'smile', color: 'text-yellow-500' },
  { emoji: '⭐', name: 'star', color: 'text-yellow-400' },
  { emoji: '⚡', name: 'lightning', color: 'text-purple-500' },
];

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

interface LiveReactionsProps {
  activeTab?: 'tv' | 'radio';
}

export default function LiveReactions({ activeTab = 'tv' }: LiveReactionsProps) {
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const queryClient = useQueryClient();

  // Fetch live reactions from database
  const { data: recentReactions = [] } = useQuery({
    queryKey: ['/api/live-reactions', activeTab],
    queryFn: () => fetch(`/api/live-reactions/${activeTab}?limit=50`).then(res => res.json()),
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Fetch active user count
  const { data: userCountData } = useQuery({
    queryKey: ['/api/active-users/count', activeTab],
    queryFn: () => fetch(`/api/active-users/count/${activeTab}`).then(res => res.json()),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Calculate reaction counts from recent reactions
  const reactionCounts = Array.isArray(recentReactions) 
    ? recentReactions.reduce((counts: Record<string, number>, reaction: any) => {
        counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
        return counts;
      }, {})
    : {};

  const tvReactions = [
    { name: 'heart', emoji: '❤️', color: 'text-red-500' },
    { name: 'thumbsup', emoji: '👍', color: 'text-blue-500' },
    { name: 'eyes', emoji: '👀', color: 'text-green-500' },
    { name: 'clap', emoji: '👏', color: 'text-yellow-500' },
    { name: 'fire', emoji: '🔥', color: 'text-orange-500' },
  ];

  const radioReactions = [
    { name: 'music', emoji: '🎵', color: 'text-green-500' },
    { name: 'headphones', emoji: '🎧', color: 'text-blue-500' },
    { name: 'dance', emoji: '💃', color: 'text-purple-500' },
    { name: 'microphone', emoji: '🎤', color: 'text-red-500' },
    { name: 'speaker', emoji: '🔊', color: 'text-orange-500' },
  ];

  const reactions = activeTab === 'tv' ? tvReactions : radioReactions;

  // Send reaction to database
  const reactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      const response = await apiRequest("POST", "/api/live-reactions", {
        emoji,
        streamType: activeTab,
        userSession: Math.random().toString(36).substring(7) // Simple session ID
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/live-reactions', activeTab] });
    },
  });

  // Track active user
  const activeUserMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/active-users", {
        streamType: activeTab,
        sessionId: `user_${Math.random().toString(36).substring(7)}`,
        lastSeen: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
      return response.json();
    },
  });

  // Update active user status
  useEffect(() => {
    activeUserMutation.mutate();
    const interval = setInterval(() => {
      activeUserMutation.mutate();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleReaction = (emoji: string, name: string) => {
    // Send reaction to database
    reactionMutation.mutate(emoji);

    // Create floating reaction
    const newReaction: FloatingReaction = {
      id: Math.random().toString(36).substring(7),
      emoji,
      x: Math.random() * 300 + 20,
      y: Math.random() * 100 + 50,
    };

    setFloatingReactions(prev => [...prev, newReaction]);

    // Remove floating reaction after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <Card className="p-4 relative">
      <h3 className="font-semibold mb-3 text-gray-900">
        Live Reactions {activeTab === 'tv' ? '📺 TV' : '📻 Radio'}
      </h3>
      
      {/* Floating Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute animate-bounce text-2xl"
            style={{
              left: `${reaction.x}px`,
              top: `${reaction.y}px`,
              animation: `float 2s ease-out forwards`,
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
      
      {/* Reaction Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {reactions.map((reaction) => (
          <Button
            key={reaction.name}
            variant="outline"
            size="sm"
            onClick={() => handleReaction(reaction.emoji, reaction.name)}
            className="flex items-center space-x-1 hover:scale-110 transition-transform border-red-200 hover:border-red-300"
            disabled={reactionMutation.isPending}
          >
            <span className="text-lg">{reaction.emoji}</span>
            <span className={`font-medium ${reaction.color}`}>
              {reactionCounts[reaction.emoji] || 0}
            </span>
          </Button>
        ))}
      </div>
      
      {/* Total Engagement */}
      <div className="text-sm text-gray-600">
        <span className="font-medium text-red-600">
          {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
        </span> total reactions from {userCountData?.count || 0} active viewers
      </div>
    </Card>
  );
}