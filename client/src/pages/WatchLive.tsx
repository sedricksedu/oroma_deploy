import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WatchLive() {
  const schedule = [
    { time: "6:00 PM", title: "News Bulletin", status: "Now Playing" },
    { time: "7:00 PM", title: "Cultural Heritage Hour", status: "Up Next" },
    { time: "8:00 PM", title: "Youth Connect Talk Show", status: "Later" },
    { time: "9:00 PM", title: "Music & Entertainment", status: "Later" },
    { time: "10:00 PM", title: "Late Night Update", status: "Later" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="fluid-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Stream */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <Badge className="live-indicator bg-red-600 text-white px-4 py-2">
                <span className="live-dot w-2 h-2 bg-white rounded-full mr-2"></span>
                LIVE NOW
              </Badge>
              <h1 className="text-2xl font-bold">News Bulletin</h1>
            </div>
            
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-900">
                <div className="text-center text-white">
                  <i className="fas fa-play-circle text-6xl mb-4 opacity-70"></i>
                  <h3 className="text-xl font-semibold mb-2">Live Stream</h3>
                  <p className="text-gray-300">
                    Click to watch our live broadcast
                  </p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700">
                    <i className="fas fa-play mr-2"></i>
                    Watch Live
                  </Button>
                </div>
              </div>
            </div>

            <Card className="card-spacing">
              <CardHeader>
                <CardTitle>About This Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our comprehensive news bulletin brings you the latest updates from Northern Uganda and beyond. 
                  Covering local politics, community developments, weather updates, and regional news that matters to you.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">News</Badge>
                  <Badge variant="secondary">Current Affairs</Badge>
                  <Badge variant="secondary">Local Updates</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Program Schedule */}
          <div>
            <Card className="card-spacing">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      item.status === "Now Playing"
                        ? "bg-red-50 border-red-200"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-lg">{item.time}</span>
                      <Badge
                        variant={item.status === "Now Playing" ? "default" : "secondary"}
                        className={item.status === "Now Playing" ? "bg-red-600" : ""}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{item.title}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Missed a Show?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Catch up on our recent programs and highlights from past episodes.
                </p>
                <Button variant="outline" className="w-full">
                  <i className="fas fa-history mr-2"></i>
                  View Archive
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Program Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Have a program suggestion or want to request specific content?
                </p>
                <Button variant="outline" className="w-full">
                  <i className="fas fa-envelope mr-2"></i>
                  Send Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
