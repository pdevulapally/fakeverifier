"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Database, Globe, Users, FileText, Clock, AlertTriangle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
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
              <Eye className="h-6 w-6 text-blue-600" />
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              FakeVerifier ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered news verification service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using FakeVerifier, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </Card>

          {/* Information We Collect */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Email address and authentication credentials</li>
                  <li>• Name and profile information (if provided)</li>
                  <li>• Payment information (processed securely by Stripe)</li>
                  <li>• Communication preferences and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Usage Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Content you submit for verification (news articles, URLs, text)</li>
                  <li>• Verification history and analysis results</li>
                  <li>• Usage patterns and feature interactions</li>
                  <li>• Token consumption and subscription data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Operating system and device identifiers</li>
                  <li>• Usage analytics and performance data</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* How We Use Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              How We Use Your Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Provision</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Process verification requests using AI analysis</li>
                  <li>• Provide personalized results and recommendations</li>
                  <li>• Maintain your verification history</li>
                  <li>• Manage your account and subscription</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Service Improvement</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Enhance AI model accuracy and performance</li>
                  <li>• Develop new features and capabilities</li>
                  <li>• Analyze usage patterns for optimization</li>
                  <li>• Conduct research and development</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Communication</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Send service updates and notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Share important policy changes</li>
                  <li>• Respond to your inquiries</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security & Compliance</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Protect against fraud and abuse</li>
                  <li>• Ensure service security and integrity</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Enforce our terms of service</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Information Sharing */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Information Sharing and Disclosure
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">We Do Not Sell Your Data</h4>
                    <p className="text-yellow-700 text-sm">
                      FakeVerifier does not sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Service Providers</h3>
                <p className="text-muted-foreground mb-3">
                  We may share information with trusted third-party service providers who assist us in:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI model processing and analysis (OpenAI, News APIs)</li>
                  <li>• Payment processing (Stripe)</li>
                  <li>• Cloud infrastructure and hosting (Vercel, Firebase)</li>
                  <li>• Analytics and monitoring services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Business Transfers</h3>
                <p className="text-muted-foreground">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
                </p>
              </div>
            </div>
          </Card>

          {/* Data Security */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Data Security
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Encryption</h4>
                  <p className="text-green-700 text-sm">
                    All data is encrypted in transit and at rest using AES-256 encryption.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Access Controls</h4>
                  <p className="text-green-700 text-sm">
                    Strict access controls and authentication mechanisms protect your data.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Regular Audits</h4>
                  <p className="text-green-700 text-sm">
                    We conduct regular security audits and vulnerability assessments.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Secure Infrastructure</h4>
                  <p className="text-green-700 text-sm">
                    Our infrastructure is hosted on secure, SOC 2 compliant platforms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Retention */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Data Retention
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Account Information</span>
                  <Badge variant="secondary">Until account deletion</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Verification History</span>
                  <Badge variant="secondary">2 years</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Usage Analytics</span>
                  <Badge variant="secondary">1 year</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Payment Records</span>
                  <Badge variant="secondary">7 years (legal requirement)</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Your Rights and Choices
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Access and Control</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Access your personal information</li>
                  <li>• Update or correct your data</li>
                  <li>• Download your verification history</li>
                  <li>• Delete your account and data</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Communication Preferences</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Opt out of marketing communications</li>
                  <li>• Control notification settings</li>
                  <li>• Manage email preferences</li>
                  <li>• Unsubscribe from updates</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Contact Us:</strong> To exercise your rights or make privacy-related requests, please contact us at{" "}
                <a href="mailto:privacy@fakeverifier.com" className="underline hover:text-blue-600">
                  privacy@fakeverifier.com
                </a>
              </p>
            </div>
          </Card>

          {/* International Transfers */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
            </p>
          </Card>

          {/* Children's Privacy */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </Card>

          {/* Changes to Policy */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
            </p>
          </Card>

          {/* Contact Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
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
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
