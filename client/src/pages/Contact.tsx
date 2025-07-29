import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Building } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["Plot 000 Semsem Building Won Nyaci Road", "Lira City, Northern Uganda"],
    color: "text-red-600"
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+256 772 123 456", "+256 751 789 012"],
    color: "text-blue-600"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@oromatv.com", "news@oromatv.com"],
    color: "text-green-600"
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
    color: "text-purple-600"
  }
];

const departments = [
  {
    name: "General Inquiries",
    email: "info@oromatv.com",
    phone: "+256 772 123 456"
  },
  {
    name: "News & Editorial",
    email: "news@oromatv.com",
    phone: "+256 772 123 457"
  },
  {
    name: "Programs & Production",
    email: "programs@oromatv.com",
    phone: "+256 772 123 458"
  },
  {
    name: "Advertising & Partnerships",
    email: "advertising@oromatv.com",
    phone: "+256 772 123 459"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      contactMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="fluid-container section-padding">
        {/* Header */}
        <div className="text-center content-wrapper section-spacing">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with Oroma TV. We'd love to hear from you and answer any questions you may have.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 section-spacing">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="card-spacing">
                  <IconComponent className={`h-12 w-12 ${info.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-red-600" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Contact Options */}
          <div className="space-y-6">
            {/* WhatsApp Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <i className="fab fa-whatsapp text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">WhatsApp</h3>
                    <p className="text-gray-600">Quick messages and support</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">+256 777 676 206</p>
                <a
                  href="https://wa.me/256777676206"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <i className="fab fa-whatsapp mr-2"></i>
                    Chat on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="#" className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i className="fab fa-facebook-f mr-2"></i>
                    Facebook
                  </a>
                  <a href="#" className="flex items-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    <i className="fab fa-twitter mr-2"></i>
                    Twitter
                  </a>
                  <a href="#" className="flex items-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <i className="fab fa-instagram mr-2"></i>
                    Instagram
                  </a>
                  <a href="#" className="flex items-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i className="fab fa-youtube mr-2"></i>
                    YouTube
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-800">Breaking News Hotline</h3>
                </div>
                <p className="text-red-700 mb-2">For urgent news tips and breaking stories</p>
                <p className="text-red-800 font-semibold">+256 700 123 456</p>
                <p className="text-red-600 text-sm">Available 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Contacts */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-red-600" />
              Department Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">{dept.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${dept.email}`} className="hover:text-red-600 transition-colors">
                        {dept.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${dept.phone}`} className="hover:text-red-600 transition-colors">
                        {dept.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-red-600" />
              Find Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-4">Visit Our Studio</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <strong>Address:</strong><br />
                    Won Nyaci Road, opposite VH Public Nursery School<br />
                    Lira City, Northern Uganda
                  </p>
                  <p>
                    <strong>Landmark:</strong><br />
                    Opposite VH Public Nursery School, Won Nyaci Road
                  </p>
                  <p>
                    <strong>Parking:</strong><br />
                    Free parking available on-site
                  </p>
                </div>
                <Button className="mt-4 bg-red-600 hover:bg-red-700">
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </div>
              
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p>Google Maps integration will be implemented here</p>
                    <Button variant="outline" className="mt-4">
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
