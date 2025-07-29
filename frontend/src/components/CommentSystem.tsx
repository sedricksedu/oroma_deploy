import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "@shared/schema";

interface CommentSystemProps {
  newsId: string;
  commentsEnabled: boolean;
}

export function CommentSystem({ newsId, commentsEnabled }: CommentSystemProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/news", newsId, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/news/${newsId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: commentsEnabled,
  });

  const submitComment = useMutation({
    mutationFn: async (commentData: any) => {
      const res = await apiRequest("POST", `/api/news/${newsId}/comments`, commentData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news", newsId, "comments"] });
      setFormData({ authorName: "", authorEmail: "", content: "" });
      setIsSubmitting(false);
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted for approval.",
      });
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    submitComment.mutate(formData);
  };

  if (!commentsEnabled) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Name *</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Email</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                  placeholder="your@email.com (optional)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Comment *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your thoughts..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Comment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{comment.authorName}</span>
                    <span className="text-sm text-gray-500">
                      {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="mt-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}