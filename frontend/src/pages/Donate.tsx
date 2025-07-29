import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Smartphone, CreditCard, Building, Users, BookOpen, Tv, Star } from "lucide-react";

const donationMethods = [
  {
    icon: Smartphone,
    title: "Mobile Money",
    subtitle: "Quick & Convenient",
    methods: [
      { provider: "MTN Mobile Money", number: "+256 772 123 456" },
      { provider: "Airtel Money", number: "+256 751 789 012" }
    ],
    color: "bg-green-600"
  },
  {
    icon: Building,
    title: "Bank Transfer",
    subtitle: "Secure Banking",
    methods: [
      { provider: "Stanbic Bank", number: "Account: 9030012345678" },
      { provider: "Centenary Bank", number: "Account: 1234567890123" }
    ],
    color: "bg-blue-600"
  },
  {
    icon: CreditCard,
    title: "Online Payment",
    subtitle: "Coming Soon",
    methods: [
      { provider: "Credit/Debit Cards", number: "Visa, Mastercard accepted" },
      { provider: "PayPal", number: "International donations" }
    ],
    color: "bg-purple-600"
  }
];

const impactStories = [
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Your donations help fund educational content that reaches over 10,000 students monthly across Northern Uganda.",
    impact: "10,000+ students reached monthly",
    color: "bg-blue-50 text-blue-700"
  },
  {
    icon: Users,
    title: "Community Outreach",
    description: "Support enables us to cover important community events and local development stories that matter to our viewers.",
    impact: "50+ community events covered yearly",
    color: "bg-green-50 text-green-700"
  },
  {
    icon: Tv,
    title: "Technology Updates",
    description: "Contributions help maintain and upgrade our broadcasting equipment for better quality programming and wider reach.",
    impact: "24/7 quality broadcasting maintained",
    color: "bg-red-50 text-red-700"
  }
];

const donationTiers = [
  {
    amount: "UGX 10,000",
    title: "Community Supporter",
    benefits: ["Monthly newsletter", "Special acknowledgment"],
    popular: false
  },
  {
    amount: "UGX 50,000",
    title: "Program Sponsor",
    benefits: ["Newsletter", "Acknowledgment", "Program updates", "Invitation to events"],
    popular: true
  },
  {
    amount: "UGX 100,000",
    title: "Media Partner",
    benefits: ["All previous benefits", "Quarterly reports", "VIP event access", "Behind-the-scenes content"],
    popular: false
  }
];

export default function Donate() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Our Mission</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-8">
            Help us continue bringing quality programming and valuable information to Northern Uganda. 
            Every contribution makes a difference in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Heart className="mr-2 h-5 w-5" />
              Donate Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ways to Donate</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the most convenient method for you to support Oroma TV's mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <p className="text-gray-600">{method.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {method.methods.map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-sm">{item.provider}</div>
                          <div className="text-gray-600 text-sm">{item.number}</div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      {method.title === "Online Payment" ? "Coming Soon" : "Donate via " + method.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Support Levels</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose a support level that works for you and see the impact you'll make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationTiers.map((tier, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-shadow ${tier.popular ? 'ring-2 ring-red-600' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{tier.amount}</div>
                  <CardTitle className="text-xl">{tier.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <Star className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    Choose This Level
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your donations directly contribute to our mission and impact communities across Northern Uganda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStories.map((story, index) => {
              const IconComponent = story.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${story.color} rounded-full flex items-center justify-center mb-6`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {story.impact}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Financial Transparency</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h3 className="font-semibold mb-2">85% Program Funding</h3>
                    <p className="text-gray-600">Direct investment in programming, equipment, and community outreach initiatives.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h3 className="font-semibold mb-2">10% Operations</h3>
                    <p className="text-gray-600">Essential operational costs including utilities, maintenance, and staff support.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h3 className="font-semibold mb-2">5% Administration</h3>
                    <p className="text-gray-600">Minimal administrative costs to ensure efficient fund management.</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-red-600 hover:bg-red-700">
                View Annual Report
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">UGX 2.5M</div>
                <div className="text-sm text-gray-600">Raised This Year</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">150+</div>
                <div className="text-sm text-gray-600">Active Supporters</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Donor Satisfaction</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">3</div>
                <div className="text-sm text-gray-600">New Programs Funded</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of supporters and help us continue being the voice of Northern Uganda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Heart className="mr-2 h-5 w-5" />
              Make a Donation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Users className="mr-2 h-5 w-5" />
              Become a Monthly Supporter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
