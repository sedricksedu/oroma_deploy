import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const photos = [
  {
    id: 1,
    url: "https://www.kakebe.tech/assets/img/6.JPG",
    title: "Tech Innovation Workshop",
    description: "Young innovators learning cutting-edge technology skills"
  },
  {
    id: 2,
    url: "https://www.kakebe.tech/assets/img/8.JPG",
    title: "Community Technology Training",
    description: "Empowering local communities through technology education"
  },
  {
    id: 3,
    url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=232,h=232,fit=crop/AoPGz40vLkSp2Vlx/robotics-6-ALpe3w440XUno2nn.JPG",
    title: "Robotics Development",
    description: "Building the future with robotics and automation"
  },
  {
    id: 4,
    url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=232,h=232,fit=crop/AoPGz40vLkSp2Vlx/app-class-9-YBg70MNNBOTxDo8N.JPG",
    title: "Mobile App Development",
    description: "Creating innovative mobile solutions for local challenges"
  },
  {
    id: 5,
    url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=232,h=232,fit=crop/AoPGz40vLkSp2Vlx/flutter-6-AQEpJj9bvxtMJOEA.jpeg",
    title: "Flutter Development Training",
    description: "Advanced mobile development with modern frameworks"
  },
  {
    id: 6,
    url: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=232,h=232,fit=crop/AoPGz40vLkSp2Vlx/nyg-8-YbN9Dy4ZPruNK1Bw.jpg",
    title: "Youth Tech Leadership",
    description: "Inspiring the next generation of tech leaders"
  }
];

export default function PhotoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-center mb-6">Innovation in Action</h3>
      <div 
        className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Photos */}
        <div className="relative w-full h-full">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h4 className="text-lg font-semibold mb-1">{photo.title}</h4>
                <p className="text-sm text-gray-200">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={prevPhoto}
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
          onClick={nextPhoto}
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}