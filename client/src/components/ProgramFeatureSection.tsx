import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import { InterviewRequestModal } from "./InterviewRequestModal";
import { ProgramProposalModal } from "./ProgramProposalModal";

export default function ProgramFeatureSection() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  return (
    <>
      <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Want to Feature on Our Programs?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're always looking for interesting stories and guests from Northern Uganda.
            Get in touch with our programming team to learn about opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setShowInterviewModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              size="lg"
            >
              <Calendar className="h-5 w-5" />
              Schedule Interview
            </Button>
            
            <Button 
              onClick={() => setShowProposalModal(true)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center gap-2"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              Program Proposal
            </Button>
          </div>
        </div>
      </Card>

      <InterviewRequestModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
      />
      
      <ProgramProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
      />
    </>
  );
}