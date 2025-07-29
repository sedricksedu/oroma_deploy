import { ReactNode } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  backgroundImage, 
  children, 
  className = '' 
}: HeroSectionProps) {
  return (
    <div 
      className={`relative bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden ${className}`}
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.8), rgba(153, 27, 27, 0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}