import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Tv, 
  Calendar, 
  Newspaper, 
  Users, 
  Phone, 
  Info, 
  Shield, 
  FileText,
  Radio,
  Camera,
  DollarSign
} from "lucide-react";

const sitePages = [
  {
    category: "Main Pages",
    icon: Home,
    pages: [
      { name: "Home", href: "/", description: "Live streaming TV and Radio" },
      { name: "Watch Live", href: "/watch-live", description: "Live TV broadcasts and programs" },
      { name: "QFM Radio", href: "/radio", description: "Live radio streaming 94.3 FM" },
    ]
  },
  {
    category: "Content",
    icon: Tv,
    pages: [
      { name: "Newsroom", href: "/newsroom", description: "Latest news and articles" },
      { name: "Programs", href: "/programs", description: "TV and radio program schedules" },
      { name: "Events", href: "/events", description: "Upcoming community events" },
      { name: "Media Gallery", href: "/media", description: "Photos and video content" },
    ]
  },
  {
    category: "About & Contact",
    icon: Users,
    pages: [
      { name: "About", href: "/about", description: "About Oroma TV and our mission" },
      { name: "Contact", href: "/contact", description: "Get in touch with us" },
      { name: "Donate", href: "/donate", description: "Support our broadcasting mission" },
    ]
  },
  {
    category: "Legal",
    icon: Shield,
    pages: [
      { name: "Privacy Policy", href: "/privacy-policy", description: "How we protect your information" },
      { name: "Terms of Service", href: "/terms-of-service", description: "Terms and conditions of use" },
      { name: "Sitemap", href: "/sitemap", description: "Complete site navigation" },
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through all pages and sections of Oroma TV's website. 
            Find everything from live streaming to community events and news.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {sitePages.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.category} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-red-600" />
                    {section.category}
                  </CardTitle>
                  <CardDescription>
                    {section.category === "Main Pages" && "Core streaming and broadcasting pages"}
                    {section.category === "Content" && "News, programs, and media content"}
                    {section.category === "About & Contact" && "Information about us and how to reach us"}
                    {section.category === "Legal" && "Legal documents and policies"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.pages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                              {page.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {page.description}
                            </p>
                          </div>
                          <div className="text-gray-400 group-hover:text-red-500 transition-colors">
                            →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Website Overview</CardTitle>
            <CardDescription className="text-center">
              Complete overview of Oroma TV's digital presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Tv className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Live Streams</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Newspaper className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">News Articles</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Weekly Programs</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Daily Viewers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" />
              Need Help Finding Something?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our team is here to help you navigate our website 
              and find the content you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Contact Support
                </button>
              </Link>
              <Link href="/">
                <button className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} Oroma TV. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}