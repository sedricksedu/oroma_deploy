import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const newsSlides = [
  {
    id: 1,
    title: "Kakebe Technologies Empowers Northern Uganda Through Innovation",
    excerpt: "Youth-led IT company transforms communities with digital solutions, from e-commerce to AI-driven tools, bridging the digital divide.",
    image: "https://www.kakebe.tech/assets/img/General.jpg",
    date: "2025-01-26",
    author: "Oroma TV News"
  },
  {
    id: 2,
    title: "Tech Camp 2025: Inspiring the Next Generation of Innovators",
    excerpt: "Transformative 2-week residential tech camp empowers over 250 East African youths with cutting-edge digital skills in Lira City.",
    image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/AoPGz40vLkSp2Vlx/kakebe3group-Yan930arEXTjlPQL.jpg",
    date: "2025-01-25",
    author: "Tech Correspondent"
  },
  {
    id: 3,
    title: "Robotics and AI Revolution in Northern Uganda",
    excerpt: "Young innovators showcase groundbreaking robotics projects and AI solutions designed to solve real-world challenges in the region.",
    image: "https://www.kakebe.tech/assets/img/robotics.JPG",
    date: "2025-01-24",
    author: "Innovation Reporter"
  },
  {
    id: 4,
    title: "Digital Skills Training Transforms Youth Opportunities",
    excerpt: "Comprehensive training programs in software development, digital marketing, and cybersecurity create new pathways for young professionals.",
    image: "https://www.kakebe.tech/assets/img/tech%20camp%20closer.jpg",
    date: "2025-01-23",
    author: "Education Desk"
  },
  {
    id: 5,
    title: "Community Impact Through Technology Innovation",
    excerpt: "Local tech initiatives demonstrate measurable impact on education, agriculture, and business development across Northern Uganda.",
    image: "https://www.kakebe.tech/assets/img/visits.jpg",
    date: "2025-01-22",
    author: "Community Reporter"
  }
];

export default function NewsSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsSlides.length) % newsSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {newsSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <Card className="bg-black/20 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-200 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(slide.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{slide.author}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                      {slide.title}
                    </h3>
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      {slide.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-white/20"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white border-white/20"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {newsSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
      </div>
    </div>
  );
}