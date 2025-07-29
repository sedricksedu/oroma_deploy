import { useQuery } from '@tanstack/react-query';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  readTime: number;
  featured: boolean;
}

export function useNews() {
  return useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
  });
}

export function useNewsArticle(id: string) {
  return useQuery<NewsArticle>({
    queryKey: ['/api/news', id],
    enabled: !!id,
  });
}

export function useFeaturedNews() {
  const { data: allNews, ...rest } = useNews();
  
  return {
    ...rest,
    data: allNews?.slice(0, 6) || [] // Show latest 6 news articles instead of filtering by featured
  };
}