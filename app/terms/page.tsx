"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Shield, AlertTriangle, FileText, Users, CreditCard, Globe, Lock, Clock, CheckCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Scale className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Terms & Conditions</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms and Conditions ("Terms") govern your use of FakeVerifier, an AI-powered news verification service operated by Preetham Devulapally as part of a final year dissertation project at the University of Westminster.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using FakeVerifier, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.
            </p>
          </Card>

          {/* Service Description */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Service Description
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                FakeVerifier is an AI-powered platform that helps users verify the credibility of news articles, social media posts, and other content through:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">AI Analysis</h4>
                  <p className="text-blue-700 text-sm">
                    Advanced AI models analyze content for credibility, bias, and factual accuracy.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Source Verification</h4>
                  <p className="text-blue-700 text-sm">
                    Cross-reference information with multiple reliable news sources and databases.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Real-time Processing</h4>
                  <p className="text-blue-700 text-sm">
                    Instant analysis and verification results with confidence scoring.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Educational Resources</h4>
                  <p className="text-blue-700 text-sm">
                    Tools and insights to help users develop critical thinking skills.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* User Accounts */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              User Accounts and Registration
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Creation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You must be at least 13 years old to create an account</li>
                  <li>• Provide accurate and complete information during registration</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Account Responsibilities</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You are responsible for all activities under your account</li>
                  <li>• Do not share your account credentials with others</li>
                  <li>• Use the service in compliance with applicable laws</li>
                  <li>• Maintain appropriate security measures</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Academic Project</h4>
                    <p className="text-yellow-700 text-sm">
                      This service is part of an academic research project. While we strive for accuracy, results should not be considered as professional fact-checking advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Acceptable Use */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              Acceptable Use Policy
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Permitted Uses</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Verify news articles and social media content for personal use</li>
                  <li>• Educational and research purposes</li>
                  <li>• Fact-checking and credibility assessment</li>
                  <li>• Sharing verification results with proper attribution</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Prohibited Uses</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Submit illegal, harmful, or malicious content</li>
                  <li>• Attempt to circumvent rate limits or security measures</li>
                  <li>• Use automated tools to access the service</li>
                  <li>• Interfere with service operation or other users</li>
                  <li>• Violate intellectual property rights</li>
                  <li>• Use for commercial purposes without permission</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Zero Tolerance</h4>
                    <p className="text-red-700 text-sm">
                      Violation of these terms may result in immediate account suspension or termination without notice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription and Payment */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Subscription and Payment Terms
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Free Tier</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 50 verification tokens per month</li>
                  <li>• Basic AI analysis features</li>
                  <li>• Standard response times</li>
                  <li>• Community support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Premium Subscriptions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Pro Plan: 500 tokens/month (£9.99/month)</li>
                  <li>• Enterprise Plan: 5000 tokens/month (£99.99/month)</li>
                  <li>• Advanced features and priority support</li>
                  <li>• Faster processing times</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Subscriptions are billed monthly in advance</li>
                  <li>• Payments processed securely through Stripe</li>
                  <li>• Automatic renewal unless cancelled</li>
                  <li>• No refunds for partial months or unused tokens</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Cancellation</h3>
                <p className="text-muted-foreground">
                  You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.
                </p>
              </div>
            </div>
          </Card>

          {/* Intellectual Property */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Intellectual Property Rights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Our Rights</h3>
                <p className="text-muted-foreground mb-3">
                  FakeVerifier and its original content, features, and functionality are owned by Preetham Devulapally and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI models and algorithms</li>
                  <li>• User interface and design</li>
                  <li>• Service infrastructure and code</li>
                  <li>• Branding and trademarks</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You retain ownership of content you submit</li>
                  <li>• You grant us license to process your content for verification</li>
                  <li>• You may share verification results with proper attribution</li>
                  <li>• You may use results for personal and educational purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Third-Party Content</h3>
                <p className="text-muted-foreground">
                  Our service may include content from third-party sources. We respect intellectual property rights and expect users to do the same. Report any copyright violations to us.
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimers */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
              Disclaimers and Limitations
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">AI Limitations</h4>
                    <p className="text-orange-700 text-sm">
                      While we strive for accuracy, AI analysis may not be 100% reliable. Results should be used as one tool among many for fact-checking, not as definitive proof.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Service provided "as is" without warranties</li>
                  <li>• We may modify or discontinue features at any time</li>
                  <li>• Service may be temporarily unavailable for maintenance</li>
                  <li>• We are not liable for service interruptions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, FakeVerifier shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Indemnification</h3>
                <p className="text-muted-foreground">
                  You agree to defend, indemnify, and hold harmless FakeVerifier from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the service.
                </p>
              </div>
            </div>
          </Card>

          {/* Privacy and Data */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Privacy and Data Protection
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Data Security</h4>
                  <p className="text-green-700 text-sm">
                    We implement industry-standard security measures to protect your data.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">No Data Selling</h4>
                  <p className="text-green-700 text-sm">
                    We do not sell, rent, or trade your personal information to third parties.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">User Control</h4>
                  <p className="text-green-700 text-sm">
                    You have the right to access, modify, or delete your personal data.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Transparency</h4>
                  <p className="text-green-700 text-sm">
                    We are transparent about how we collect and use your information.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Termination */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Termination
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Termination</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You may terminate your account at any time</li>
                  <li>• We may terminate accounts for Terms violations</li>
                  <li>• Termination results in loss of access to paid features</li>
                  <li>• Some data may be retained as required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Effect of Termination</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Immediate cessation of service access</li>
                  <li>• Deletion of account data (subject to legal requirements)</li>
                  <li>• Cancellation of active subscriptions</li>
                  <li>• Survival of certain provisions (privacy, IP, etc.)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Governing Law */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Governing Law and Disputes
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dispute Resolution</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Disputes will be resolved through good faith negotiation</li>
                  <li>• If negotiation fails, disputes may be resolved in UK courts</li>
                  <li>• You agree to submit to personal jurisdiction in the UK</li>
                  <li>• Class action waivers may apply</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Changes to Terms */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the service. Your continued use after changes constitutes acceptance of the new Terms.
            </p>
          </Card>

          {/* Contact Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:preethamdevulapally@gmail.com" className="text-blue-600 hover:underline">
                  preethamdevulapally@gmail.com
                </a>
              </p>
              <p>
                <strong>Address:</strong> University of Westminster, London, UK
              </p>
              <p>
                <strong>Project:</strong> Final Year Dissertation - FakeVerifier
              </p>
              <p>
                <strong>Creator:</strong> Preetham Devulapally
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
