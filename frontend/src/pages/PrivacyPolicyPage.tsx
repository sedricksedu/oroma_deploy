import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, Eye, Lock, Database, Users, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/site-settings"],
  });

  const privacyContent = settings.find(s => s.key === "privacy_policy")?.value || getDefaultPrivacyPolicy();

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
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. Learn how we protect your information.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-600" />
              Information We Collect
            </CardTitle>
            <CardDescription>
              Types of information Oroma TV collects when you use our services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600">
                We collect information you provide directly, such as when you subscribe to our newsletter, 
                contact us, or participate in our interactive features like live comments and song requests.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <p className="text-gray-600">
                We automatically collect information about how you use our website and streaming services, 
                including viewing preferences, device information, and interaction patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-red-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-gray-600">
              <li>• Provide and improve our streaming services</li>
              <li>• Send newsletters and important updates</li>
              <li>• Respond to your inquiries and support requests</li>
              <li>• Analyze usage patterns to enhance user experience</li>
              <li>• Ensure platform security and prevent abuse</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Information Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information only in the following circumstances:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• With your explicit consent</li>
              <li>• To comply with legal requirements</li>
              <li>• To protect our rights and prevent fraud</li>
              <li>• With service providers who assist in our operations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate information</li>
              <li>• Request deletion of your information</li>
              <li>• Opt-out of marketing communications</li>
              <li>• File a complaint with data protection authorities</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or your personal information, contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> privacy@oromatv.com</p>
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

function getDefaultPrivacyPolicy() {
  return `This Privacy Policy describes how Oroma TV collects, uses, and protects your information when you use our streaming services and website.`;
}