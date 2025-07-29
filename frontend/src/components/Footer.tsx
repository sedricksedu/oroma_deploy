import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const oromaTvLogo = "/oromatv-logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

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
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate(email);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img 
                src={oromaTvLogo}
                alt="Oroma TV Logo" 
                className="h-16 md:h-24 w-auto mb-2"
              />
              <p className="text-gray-300 text-xs md:text-sm font-medium">"Dwon tumalo me Uganda"</p>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Connecting communities through quality programming and meaningful storytelling.
            </p>
            <div className="flex space-x-2 md:space-x-3">
              <a href="https://www.facebook.com/943qfmlira/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com/943qfmlira/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.tiktok.com/@oromatvuganda" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://www.youtube.com/@oromatvuganda" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/watch-live" className="text-gray-300 hover:text-white transition-colors">Watch Live</Link></li>
              <li><Link href="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link></li>
              <li><Link href="/newsroom" className="text-gray-300 hover:text-white transition-colors">Newsroom</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/media" className="text-gray-300 hover:text-white transition-colors">Media</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300 mb-6">
              <p><i className="fas fa-map-marker-alt mr-2"></i>Plot 000 Semsem Building Won Nyaci Road, Lira City</p>
              <p><i className="fas fa-phone mr-2"></i>+256 772 123 456</p>
              <p><i className="fas fa-envelope mr-2"></i>info@oromatv.com</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2">Newsletter</h5>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-gray-300">&copy; {new Date().getFullYear()} Oroma TV. All rights reserved.</p>
            <p className="text-gray-400 text-xs mt-1">
              Website developed by <a href="https://www.kakebe.tech" className="text-red-400 hover:text-red-300">Kakebe Technologies Limited</a>
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
