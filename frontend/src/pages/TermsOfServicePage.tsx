import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Users, AlertTriangle, Scale, Gavel, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const termsContent = settings.find(s => s.key === "terms_of_service")?.value || getDefaultTermsOfService();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using Oroma TV services.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-red-600" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              By accessing and using Oroma TV's website and streaming services, you accept and agree to be 
              bound by the terms and provision of this agreement. These terms apply to all visitors, users, 
              and others who access or use our service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Use of Services
            </CardTitle>
            <CardDescription>
              Guidelines for using Oroma TV's platform and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Permitted Use</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Watch our live TV broadcasts and radio streams</li>
                <li>• Participate in live comments and reactions</li>
                <li>• Subscribe to our newsletter and updates</li>
                <li>• Request songs during appropriate programming</li>
                <li>• Share our content on social media platforms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prohibited Activities</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Posting inappropriate, offensive, or illegal content</li>
                <li>• Attempting to disrupt our streaming services</li>
                <li>• Impersonating others or providing false information</li>
                <li>• Using automated systems to access our services</li>
                <li>• Redistributing our content without permission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              All content on Oroma TV, including but not limited to text, graphics, logos, audio clips, 
              video clips, and software, is the property of Oroma TV or its content suppliers and is 
              protected by copyright and other intellectual property laws.
            </p>
            <p className="text-gray-600">
              You may not reproduce, distribute, modify, or create derivative works of our content 
              without explicit written permission from Oroma TV.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              User Content and Conduct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Content Standards</h3>
              <p className="text-gray-600 mb-2">
                When participating in live comments, song requests, or other interactive features, you agree that your content:
              </p>
              <ul className="space-y-1 text-gray-600">
                <li>• Does not violate any laws or regulations</li>
                <li>• Is not defamatory, obscene, or offensive</li>
                <li>• Does not infringe on others' rights</li>
                <li>• Does not contain spam or promotional material</li>
                <li>• Respects community guidelines and cultural values</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Moderation</h3>
              <p className="text-gray-600">
                Oroma TV reserves the right to monitor, edit, or remove any user-generated content 
                that violates these terms or is deemed inappropriate for our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We strive to provide continuous broadcasting services, but cannot guarantee uninterrupted access. 
              Our services may be temporarily unavailable due to:
            </p>
            <ul className="space-y-1 text-gray-600">
              <li>• Scheduled maintenance</li>
              <li>• Technical difficulties</li>
              <li>• Internet connectivity issues</li>
              <li>• Force majeure events</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-red-600" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Oroma TV shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your use of our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We may terminate or suspend your access to our services immediately, without prior notice 
              or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We reserve the right to modify or replace these Terms at any time. If a revision is 
              material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> legal@oromatv.com</p>
              <p><strong>Phone:</strong> +256 392 945 943</p>
              <p><strong>Address:</strong> Lira City, Northern Uganda</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getDefaultTermsOfService() {
  return `These Terms of Service govern your use of Oroma TV's website and streaming services. By using our services, you agree to these terms.`;
}