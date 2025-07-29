import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Eye, Award, MapPin, Phone, Mail } from "lucide-react";
import HeroSection from "@/components/HeroSection";

const teamMembers = [
  {
    name: "Joseph Okello",
    role: "Station Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    bio: "Leading Oroma TV with over 15 years of media experience in Northern Uganda."
  },
  {
    name: "Grace Akello",
    role: "News Director",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b766?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    bio: "Award-winning journalist committed to bringing authentic stories from our communities."
  },
  {
    name: "Samuel Odongo",
    role: "Programs Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    bio: "Creative director ensuring our programs reflect Northern Uganda's rich cultural diversity."
  },
  {
    name: "Mary Lamuno",
    role: "Community Relations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    bio: "Building bridges between Oroma TV and the communities we serve across the region."
  }
];

const achievements = [
  { icon: Users, title: "50,000+", subtitle: "Daily Viewers" },
  { icon: Target, title: "24/7", subtitle: "Broadcasting" },
  { icon: Award, title: "5+", subtitle: "Awards Won" },
  { icon: Eye, title: "15+", subtitle: "Years Experience" }
];

export default function About() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(17, 24, 39, 0.8), rgba(220, 38, 38, 0.6)), url('https://www.kakebe.tech/assets/img/tech%20camp%20closer.jpg')`
            }}
          />
        </div>
        <div className="relative z-10 text-center text-white fluid-container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Oroma TV</h1>
          <p className="text-xl md:text-2xl font-light content-wrapper">
            Northern Uganda's premier media house, dedicated to amplifying the voices, 
            stories, and culture of our vibrant region.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="fluid-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <img
                src="https://www.kakebe.tech/assets/img/visits.jpg"
                alt="Oroma TV Studio"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be the authentic voice of Northern Uganda, providing quality programming that 
                  informs, educates, and entertains while preserving and promoting our rich cultural heritage.
                  We partner with leading organizations like Kakebe Technologies and QFM Radio Station to deliver excellence.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To bridge communities through meaningful content that reflects the true spirit of 
                  Northern Uganda, fostering unity, development, and cultural pride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="fluid-container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <IconComponent className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="fluid-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to bringing you authentic stories and quality programming.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute bottom-3 left-3 bg-red-600 text-white">
                    {member.role}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Visit Our Studio</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-red-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-gray-600">
                      Won Nyaci Road, opposite VH Public Nursery School<br />
                      Lira City, Northern Uganda
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-red-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">
                      +256 772 123 456<br />
                      +256 751 789 012
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-red-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      info@oromatv.com<br />
                      news@oromatv.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Since our establishment, Oroma TV has been committed to delivering quality programming 
                  that informs, educates, and entertains our diverse audience across Northern Uganda.
                </p>
                <p>
                  We believe in the power of authentic storytelling to bring communities together, 
                  celebrate our rich cultural heritage, and drive positive change in our region.
                </p>
                <p>
                  Our dedicated team of journalists, producers, and community relations specialists 
                  work tirelessly to ensure that every voice in Northern Uganda has the opportunity to be heard.
                </p>
              </div>
              
              <div className="mt-8">
                <Button className="bg-red-600 hover:bg-red-700 mr-4">
                  Join Our Team
                </Button>
                <Button variant="outline">
                  Partnership Opportunities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
