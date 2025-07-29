import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Music, Send, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SongRequestFormProps {
  streamType: 'tv' | 'radio';
}

export default function SongRequestForm({ streamType }: SongRequestFormProps) {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent song requests
  const { data: recentRequests = [] } = useQuery({
    queryKey: ['/api/song-requests', streamType],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/song-requests?streamType=${streamType}`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    }
  });

  const songRequestMutation = useMutation({
    mutationFn: async (data: { songTitle: string; artistName?: string; requesterName: string; streamType: string }) => {
      const response = await apiRequest("POST", "/api/song-requests", data);
      return response.json();
    },
    onSuccess: () => {
      // Clear form
      setSongTitle("");
      setArtistName("");
      setRequesterName("");
      
      // Show success message
      toast({
        title: "Song Request Submitted!",
        description: `Your request for "${songTitle}" has been sent to our DJ.`,
      });

      // Invalidate and refetch requests
      queryClient.invalidateQueries({ queryKey: ['/api/song-requests', streamType] });
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: "Unable to submit your song request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!songTitle.trim() || !requesterName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in song title and your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await songRequestMutation.mutateAsync({
        songTitle: songTitle.trim(),
        artistName: artistName.trim() || undefined,
        requesterName: requesterName.trim(),
        streamType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Music className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-gray-900">
          Request a Song {streamType === 'radio' ? '(QFM Radio)' : '(Oroma TV)'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            placeholder="Song title *"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            disabled={isSubmitting}
            className="text-sm"
          />
        </div>
        
        <div>
          <Input
            placeholder="Artist name (optional)"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            disabled={isSubmitting}
            className="text-sm"
          />
        </div>
        
        <div>
          <Input
            placeholder="Your name *"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            disabled={isSubmitting}
            className="text-sm"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || !songTitle.trim() || !requesterName.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Request Song
            </>
          )}
        </Button>
      </form>

      {/* Recent Requests */}
      {Array.isArray(recentRequests) && recentRequests.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Recent Requests:</p>
          <div className="space-y-1">
            {recentRequests.slice(0, 3).map((request: any) => (
              <div key={request.id || Math.random()} className="text-xs text-gray-600 flex justify-between">
                <span className="truncate">
                  {request.songTitle || request.title || 'Unknown Song'} {(request.artistName || request.artist) && `by ${request.artistName || request.artist}`}
                </span>
                <span className={`text-xs px-1 rounded ${
                  request.status === 'played' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status || 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}