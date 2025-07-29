import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
// Use the existing logo from public directory
const oromaTvLogo = "/oromatv-logo.png";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Newsroom", href: "/newsroom" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Programs", href: "/programs" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="fluid-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <img 
              src={oromaTvLogo}
              alt="Oroma TV Logo" 
              className="h-12 w-auto sm:h-16 md:h-20 lg:h-20 max-w-[200px] md:max-w-[280px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium text-sm lg:text-base transition-colors hover:text-red-600 ${
                  location === item.href
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/contact">
              <Button size="sm" className="btn-oroma-primary ml-2 xl:ml-4 text-xs lg:text-sm">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-center mb-8 pt-4">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <img 
                    src={oromaTvLogo}
                    alt="Oroma TV Logo" 
                    className="h-16 w-auto max-w-[180px] object-contain"
                  />
                </Link>
              </div>
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-red-600 ${
                      location === item.href
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-oroma-primary">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
