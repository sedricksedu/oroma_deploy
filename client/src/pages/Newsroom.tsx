import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, Calendar, User, ArrowRight, Eye } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { useNews } from "@/hooks/use-news";
import { useState as useFormState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Agriculture", "Education", "Health", "Politics", "Culture", "Sports", "Business"];

export default function Newsroom() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  const { data: allNews = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/subscribe", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setNewsletterEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      subscribeMutation.mutate(newsletterEmail);
    }
  };

  const filteredNews = allNews.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews[0];
  const regularNews = filteredNews.slice(1);

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <HeroSection
        title="Newsroom"
        subtitle="Stay informed with the latest news and developments from Northern Uganda"
        backgroundImage="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&auto=format&fit=crop"
      />
      
      <div className="fluid-container section-padding">

        {/* Search and Filter */}
        <div className="section-spacing">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredNews.imageUrl || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                      alt={featuredNews.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <Badge className="bg-red-600 text-white mb-3">
                      Featured
                    </Badge>
                    <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
                    <p className="text-gray-600 mb-6">{featuredNews.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {featuredNews.createdAt ? new Date(featuredNews.createdAt).toLocaleDateString() : 'No date'}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {featuredNews.views || 0} views
                        </div>
                      </div>
                      <Link href={`/news/${featuredNews.id}`}>
                        <Button className="bg-red-600 hover:bg-red-700">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Regular News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-gray-800">
                      {article.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'No date'}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views || 0} views
                        </div>
                      </div>
                    </div>
                    <Link href={`/news/${article.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="mb-6 opacity-90">
                Subscribe to our newsletter and never miss important news from Northern Uganda.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white text-gray-900"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-red-600 hover:bg-gray-100"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "..." : "Subscribe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
