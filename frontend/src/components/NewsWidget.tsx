import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/use-news';
import { useLocation } from 'wouter';

export default function NewsWidget() {
  const { data: featuredNews, isLoading, error } = useFeaturedNews();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-3 text-gray-900">Latest News</h3>
        <p className="text-red-600 text-sm">Failed to load news articles</p>
      </Card>
    );
  }

  const displayedNews = showAll ? featuredNews : featuredNews?.slice(0, 3) || [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Latest News</h3>
        <Button
          onClick={() => setLocation('/newsroom')}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {displayedNews.map((article) => (
          <div key={article.id} className="group cursor-pointer" onClick={() => setLocation(`/newsroom?article=${article.id}`)}>
            <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime || 3} min read
                  </div>
                </div>
                <h4 className="font-medium text-sm text-gray-900 group-hover:text-red-600 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{article.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {featuredNews && featuredNews.length > 3 && (
        <Button
          onClick={() => setShowAll(!showAll)}
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {showAll ? 'Show Less' : `Show ${featuredNews.length - 3} More Articles`}
        </Button>
      )}
    </Card>
  );
}