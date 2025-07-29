import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LiveCommentsProps {
  streamType: 'tv' | 'radio';
}

export default function LiveComments({ streamType }: LiveCommentsProps) {
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live comments
  const { data: comments = [], isError } = useQuery({
    queryKey: ['/api/live-comments', streamType],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/live-comments/${streamType}?limit=10`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const commentMutation = useMutation({
    mutationFn: async (data: { content: string; authorName: string; streamType: string }) => {
      const payload = {
        message: data.content,
        username: data.authorName,
        streamType: data.streamType,
        userSession: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      const response = await apiRequest("POST", "/api/live-comments", payload);
      return response.json();
    },
    onSuccess: () => {
      setComment("");
      toast({
        title: "Comment Posted!",
        description: "Your comment is now live in the chat.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/live-comments', streamType] });
    },
    onError: () => {
      toast({
        title: "Comment Failed",
        description: "Unable to post your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !authorName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and comment.",
        variant: "destructive",
      });
      return;
    }

    await commentMutation.mutateAsync({
      content: comment.trim(),
      authorName: authorName.trim(),
      streamType
    });
  };

  return (
    <Card className="p-3 md:p-4">
      <div className="flex items-center space-x-2 mb-3 md:mb-4">
        <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
          Live Chat {streamType === 'radio' ? '(QFM Radio)' : '(Oroma TV)'}
        </h3>
      </div>

      {/* Comments Display - Improved Mobile Responsiveness */}
      <div className="space-y-2 mb-3 md:mb-4 max-h-24 md:max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-2">
        {!comments || comments.length === 0 ? (
          <p className="text-xs md:text-sm text-gray-500 text-center py-2">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          Array.isArray(comments) && comments.map((c: any) => (
            <div key={c.id || Math.random()} className="bg-white rounded p-2 text-xs md:text-sm border border-gray-100">
              <div className="font-medium text-gray-900 text-xs truncate">{c.username || c.user_session || 'Anonymous'}</div>
              <div className="text-gray-700 break-words">{c.message || c.content || ''}</div>
              <div className="text-xs text-gray-400 mt-1">
                {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form - Mobile Optimized */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={commentMutation.isPending}
          className="text-xs md:text-sm h-8 md:h-10"
        />
        <div className="flex space-x-2">
          <Input
            placeholder={`Comment on ${streamType === 'radio' ? 'QFM Radio' : 'Oroma TV'}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={commentMutation.isPending}
            className="text-xs md:text-sm flex-1 h-8 md:h-10"
          />
          <Button
            type="submit"
            disabled={commentMutation.isPending || !comment.trim() || !authorName.trim()}
            size="sm"
            className="h-8 md:h-10 px-2 md:px-3 flex-shrink-0 bg-red-600 hover:bg-red-700"
          >
            {commentMutation.isPending ? (
              <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
            ) : (
              <Send className="h-3 w-3 md:h-4 md:w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}