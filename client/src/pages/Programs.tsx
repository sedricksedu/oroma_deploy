import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tv } from "lucide-react";
import { InterviewRequestModal } from "@/components/InterviewRequestModal";
import { ProgramProposalModal } from "@/components/ProgramProposalModal";

const categories = ["All", "Magazine", "Documentary", "Agriculture", "Youth", "Health", "Culture", "Business", "News", "Religious", "Entertainment"];

export default function Programs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  const { data: allPrograms = [], isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const filteredPrograms = selectedCategory === "All" 
    ? allPrograms 
    : allPrograms.filter(program => program.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="fluid-container section-padding">
        {/* Header */}
        <div className="text-center content-wrapper section-spacing">
          <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-gray-600">
            Discover our diverse range of programming that informs, educates, and entertains 
            the communities of Northern Uganda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 section-spacing">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <Tv className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Found</h3>
            <p className="text-gray-500">
              {selectedCategory === "All" 
                ? "No programs are currently available."
                : `No programs found in the ${selectedCategory} category.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="program-card overflow-hidden card-spacing">
                <div className="relative">
                  <img
                    src={program.imageUrl || "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                    {program.category}
                  </Badge>
                </div>
                <CardContent className="card-spacing">
                  <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Schedule:</span>
                      <span className="ml-1">{program.schedule}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-1">30 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Want to Feature on Our Programs?</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for interesting stories and guests from Northern Uganda. 
              Get in touch with our programming team to learn about opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowInterviewModal(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowProposalModal(true)}
              >
                <Tv className="mr-2 h-4 w-4" />
                Program Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InterviewRequestModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
      />
      
      <ProgramProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
      />
    </div>
  );
}
