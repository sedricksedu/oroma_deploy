import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SimpleFileUpload } from "@/components/ui/simple-file-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Eye, Image, MessageSquare, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { News } from "@shared/schema";

export function NewsManager() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const createMutation = useMutation({
    mutationFn: async (newsData: any) => {
      const res = await apiRequest("POST", "/api/admin/news", newsData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsCreateOpen(false);
      toast({ title: "Success", description: "News article created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/news/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setEditingNews(null);
      toast({ title: "Success", description: "News article updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-gray-600">Create and manage news articles</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create News Article</DialogTitle>
            </DialogHeader>
            <NewsForm
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <Card className="p-12 text-center">
            <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No News Articles Yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first news article</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </Card>
        ) : (
          news.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {article.imageUrl && (
                  <div className="md:w-1/3">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-6 ${article.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="secondary">{article.category}</Badge>
                        <Badge variant={article.published ? "default" : "outline"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views || 0} views
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comments {article.commentsEnabled ? "enabled" : "disabled"}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created {article.createdAt && formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => setEditingNews(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
          </DialogHeader>
          {editingNews && (
            <NewsForm
              initialData={editingNews}
              onSubmit={(data) => updateMutation.mutate({ id: editingNews.id, data })}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewsForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: News; 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    category: initialData?.category || "",
    published: initialData?.published || false,
    views: initialData?.views || 0,
    commentsEnabled: initialData?.commentsEnabled ?? true,
  });

  const [images, setImages] = useState<string[]>(
    initialData?.imageUrl ? [initialData.imageUrl] : []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission with images:', images.length);
    console.log('Form data:', { ...formData, imageUrl: images[0] || "", images: images.length });
    onSubmit({
      ...formData,
      imageUrl: images[0] || "", // Use first image as primary
      images: images, // Store all images
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Article Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter compelling article title"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select article category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Politics">Politics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-sm font-medium">Article Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="Brief summary that appears in article previews..."
              className="mt-1"
              required
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published" className="text-sm">Publish immediately</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="commentsEnabled"
                checked={formData.commentsEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, commentsEnabled: checked })}
              />
              <Label htmlFor="commentsEnabled" className="text-sm">Enable comments</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="content" className="text-sm font-medium">Article Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            placeholder="Write your article content here..."
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Image className="h-4 w-4" />
          Article Images (up to 10)
        </Label>
        <SimpleFileUpload
          images={images}
          onImagesChange={setImages}
          maxImages={10}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 px-8">
          {isLoading ? "Saving..." : initialData ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
}