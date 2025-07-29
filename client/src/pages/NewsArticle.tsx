import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, User, ArrowLeft, Eye, Share2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function NewsArticle() {
  const [match, params] = useRoute("/news/:id");
  const articleId = params?.id;

  // Fetch article and increment view count
  const { data: article, isLoading, error } = useQuery<News>({
    queryKey: ["/api/news", articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("No article ID");
      const response = await fetch(`/api/news/${articleId}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json();
    },
    enabled: !!articleId,
  });

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!match || !articleId) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <Link href="/newsroom">
            <Button>Back to Newsroom</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Article</h2>
          <p className="text-gray-600 mb-4">The article could not be loaded.</p>
          <Link href="/newsroom">
            <Button>Back to Newsroom</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/newsroom">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Newsroom
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-red-600 text-white">
                {article.category}
              </Badge>
              {article.featured && (
                <Badge variant="outline">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views || 0} views
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {article.content}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(article.updatedAt).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
                
                <Link href="/newsroom">
                  <Button size="sm">
                    More Articles
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Articles Section */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">More from {article.category}</h2>
          <div className="text-center text-gray-500">
            <p>Related articles will appear here</p>
          </div>
        </section>
      </div>
    </div>
  );
}