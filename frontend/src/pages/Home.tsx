import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import ModernRadioPlayer from "@/components/ModernRadioPlayer";
import LiveReactions from "@/components/LiveReactions";

import NewsWidget from "@/components/NewsWidget";
import SongRequestForm from "@/components/SongRequestForm";
import LiveComments from "@/components/LiveComments";
import { StreamStatus } from "@/components/StreamStatus";

import { Tv, Radio, Users, Share } from "lucide-react";

// Stream configuration
const streamConfig = {
  app: {
    name: "Oroma TV & QFM Radio",
    greetings: {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening"
    }
  },
  streams: {
    tv: {
      name: "TV Oroma",
      description: "Music, News, and Entertainment in Luo",
      location: "Uganda",
      streamUrl: "https://mediaserver.oromatv.com/LiveApp/streams/12345.m3u8",
      share: {
        message: "Check out this amazing stream on TV Oroma",
        url: "https://oromatv.com",
        title: "Oroma TV Live Stream"
      },
      about: {
        title: "Tv Oroma",
        description: "Northern Uganda's Versetail Tv Station",
        fullDescription: "Music, News, and Entertainment in Luo. Northern Uganda's Funkiest Radio Station"
      }
    },
    radio: {
      name: "QFM Radio",
      frequency: "94.3",
      location: "Lira, Uganda",
      description: "Northern Uganda's Funkiest Radio Station",
      streamUrl: "https://hoth.alonhosting.com:3975/stream",
      artworkUrl: "https://assets.mwonya.com/images/artwork/qfm_radio.png"
    }
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tv' | 'radio'>('tv');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(streamConfig.app.greetings.morning);
    } else if (hour < 18) {
      setGreeting(streamConfig.app.greetings.afternoon);
    } else {
      setGreeting(streamConfig.app.greetings.evening);
    }

    // No need for simulated viewer counts - using real data from database
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: streamConfig.streams.tv.share.title,
      text: streamConfig.streams.tv.share.message,
      url: streamConfig.streams.tv.share.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="fluid-container section-padding">
        {/* Welcome Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-red-600 to-red-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-center py-8 px-6">
            <h1 className="text-lg md:text-xl font-bold mb-2 animate-fade-in">
              {greeting}! Welcome to {streamConfig.app.name}
            </h1>
            <p className="text-sm text-red-100">
              Northern Uganda live TV and QFM Radio 94.3 FM
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* Main Player Area */}
          <div className="xl:col-span-3 order-1">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'tv' | 'radio')}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4 sm:gap-0">
                <TabsList className="grid w-full sm:max-w-md grid-cols-2">
                  <TabsTrigger value="tv" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                    <Tv className="h-3 w-3 md:h-4 md:w-4" />
                    <span>TV Oroma</span>
                  </TabsTrigger>
                  <TabsTrigger value="radio" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                    <Radio className="h-3 w-3 md:h-4 md:w-4" />
                    <span>QFM Radio</span>
                  </TabsTrigger>
                </TabsList>

                {/* Live Controls */}
                <div className="flex items-center justify-center sm:justify-end space-x-2 md:space-x-4 flex-wrap">
                  <Button
                    onClick={handleShare}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                    size="sm"
                  >
                    <Share className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm">Share</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="tv" className="space-y-6">
                <VideoPlayer
                  streamUrl={streamConfig.streams.tv.streamUrl}
                  isLive={true}
                  title={streamConfig.streams.tv.name}
                />
                
                {/* Stream Status */}
                <StreamStatus streamType="tv" streamUrl={streamConfig.streams.tv.streamUrl} />
                

                
                {/* TV Stream Info */}
                <Card className="p-6 border-red-200 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-red-800 mb-2">
                        {streamConfig.streams.tv.about.title}
                      </h3>
                      <p className="text-red-700 mb-1 font-medium">
                        {streamConfig.streams.tv.about.description}
                      </p>
                      <p className="text-red-600 text-sm">
                        {streamConfig.streams.tv.about.fullDescription}
                      </p>
                    </div>
                    <div className="text-right text-sm text-red-600">
                      <div>Broadcasting from</div>
                      <div className="font-medium text-red-800">{streamConfig.streams.tv.location}</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="radio" className="space-y-6">
                <ModernRadioPlayer
                  streamUrl={streamConfig.streams.radio.streamUrl}
                  title={streamConfig.streams.radio.name}
                  frequency={streamConfig.streams.radio.frequency}
                  artworkUrl={streamConfig.streams.radio.artworkUrl}
                  onShare={handleShare}
                />
                
                {/* Stream Status */}
                <StreamStatus streamType="radio" streamUrl={streamConfig.streams.radio.streamUrl} />
                
                {/* Radio Stream Info */}
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {streamConfig.streams.radio.name}
                      </h3>
                      <p className="text-red-600 font-medium text-lg mb-2">
                        FM {streamConfig.streams.radio.frequency}
                      </p>
                      <p className="text-gray-600">
                        {streamConfig.streams.radio.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Broadcasting from</div>
                      <div className="font-medium">{streamConfig.streams.radio.location}</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Mobile: Show reactions and comments after song requests */}
            <div className="xl:hidden mt-6 space-y-4">
              <LiveReactions activeTab={activeTab} />
              <LiveComments streamType={activeTab} />
            </div>


          </div>

          {/* Sidebar - Mobile: Below content, Desktop: Right sidebar */}
          <div className="xl:col-span-1 space-y-6 order-2 xl:order-2">
            {/* Desktop: Show reactions in sidebar */}
            <div className="hidden xl:block space-y-4">
              <LiveReactions activeTab={activeTab} />
              <LiveComments streamType={activeTab} />
            </div>

            {/* Connection Status */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-gray-900">Stream Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quality</span>
                  <span className="text-sm text-gray-900 font-medium">HD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Latency</span>
                  <span className="text-sm text-gray-900 font-medium">2.3s</span>
                </div>
              </div>
            </Card>

            {/* Song Request Form - Positioned after Stream Status */}
            <SongRequestForm streamType={activeTab} />

            {/* WhatsApp Integration */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <h3 className="font-semibold mb-3 text-gray-900">Connect with Us</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://wa.me/256777676206', '_blank')}
                >
                  <span className="mr-2">📱</span>
                  WhatsApp: 0777676206
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => window.open('/programs', '_self')}
                >
                  <Tv className="h-4 w-4 mr-2" />
                  Program Schedule
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Spacing before news section */}
        <div className="h-8"></div>
        
        {/* Most Recent News Section */}
        <NewsWidget />
      </div>
    </div>
  );
}