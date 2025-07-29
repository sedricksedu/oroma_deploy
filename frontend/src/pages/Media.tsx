import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Download, Share2, Image, Video, Mic, FileText, Eye } from "lucide-react";

const mediaItems = {
  videos: [
    {
      id: 1,
      title: "Evening News Bulletin - Latest",
      thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
      duration: "25:30",
      category: "News",
      date: "2024-01-25",
      views: "15.2K"
    },
    {
      id: 2,
      title: "Cultural Heritage Festival Highlights",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
      duration: "18:45",
      category: "Culture",
      date: "2024-01-20",
      views: "8.7K"
    },
    {
      id: 3,
      title: "Youth Connect: Leadership Discussion",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
      duration: "42:15",
      category: "Youth",
      date: "2024-01-18",
      views: "6.3K"
    }
  ],
  photos: [
    {
      id: 1,
      title: "Community Health Fair 2024",
      thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Events",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Studio Behind the Scenes",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Studio",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Agricultural Development Program",
      thumbnail: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      category: "Agriculture",
      date: "2024-01-08"
    }
  ],
  audio: [
    {
      id: 1,
      title: "Morning Radio Show - Best Moments",
      duration: "35:20",
      category: "Radio",
      date: "2024-01-25"
    },
    {
      id: 2,
      title: "Traditional Music Special",
      duration: "28:45",
      category: "Music",
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Community Leader Interview",
      duration: "22:30",
      category: "Interview",
      date: "2024-01-18"
    }
  ]
};

export default function Media() {
  const [selectedTab, setSelectedTab] = useState("videos");

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Media Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of videos, photos, and audio content showcasing the stories, 
            culture, and community of Northern Uganda.
          </p>
        </div>

        {/* Media Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-3 lg:w-96 mx-auto mb-8">
            <TabsTrigger value="videos" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center">
              <Mic className="mr-2 h-4 w-4" />
              Audio
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative group">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="lg" className="bg-red-600 hover:bg-red-700">
                        <Play className="mr-2 h-5 w-5" />
                        Play
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-black bg-opacity-70 text-white">
                      {video.duration}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                      {video.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{video.date}</span>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mediaItems.photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative group">
                    <img
                      src={photo.thumbnail}
                      alt={photo.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                      {photo.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{photo.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{photo.date}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaItems.audio.map((audio) => (
                <Card key={audio.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{audio.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{audio.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{audio.date}</span>
                        </div>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700">
                        {audio.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Media Stats */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Our Media Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="opacity-90">Videos Published</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">2K+</div>
                  <div className="opacity-90">Photos Captured</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">100+</div>
                  <div className="opacity-90">Audio Programs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">1M+</div>
                  <div className="opacity-90">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Press Kit</h3>
              <p className="text-gray-600 mb-6">
                Download our official logos, brand guidelines, and press materials for media use.
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                <Download className="mr-2 h-4 w-4" />
                Download Press Kit
              </Button>
            </Card>
            
            <Card className="p-8 text-center">
              <Share2 className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Media Partnerships</h3>
              <p className="text-gray-600 mb-6">
                Collaborate with us for content sharing, cross-promotion, and joint initiatives.
              </p>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Partnership Inquiry
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
