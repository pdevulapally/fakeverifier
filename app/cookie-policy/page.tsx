"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Cookie, 
  Shield, 
  BarChart3, 
  Settings, 
  Users, 
  Clock, 
  Info, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Globe,
  Database,
  Eye
} from "lucide-react"
import Link from "next/link"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Cookie className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This Cookie Policy explains how FakeVerifier uses cookies and similar technologies 
            to recognize you when you visit our website and how we use them.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              Last Updated: January 15, 2024
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Globe className="w-3 h-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="#what-are-cookies" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">What Are Cookies?</h3>
              <p className="text-sm text-gray-600">Learn about cookies and how they work</p>
            </Link>
            <Link href="#types-of-cookies" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">Types of Cookies</h3>
              <p className="text-sm text-gray-600">Different categories of cookies we use</p>
            </Link>
            <Link href="#cookie-details" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">Cookie Details</h3>
              <p className="text-sm text-gray-600">Specific cookies and their purposes</p>
            </Link>
            <Link href="#manage-cookies" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-gray-900">Manage Cookies</h3>
              <p className="text-sm text-gray-600">How to control your cookie preferences</p>
            </Link>
          </div>
        </Card>

        {/* What Are Cookies */}
        <section id="what-are-cookies" className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-blue-600" />
              What Are Cookies?
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) 
                when you visit a website. They are widely used to make websites work more efficiently 
                and provide useful information to website owners.
              </p>
              <p className="text-gray-700 mb-4">
                Cookies can be categorized by their function, lifespan, and the domain that places them 
                on your device. They help us provide you with a better experience by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Remembering your preferences and settings</li>
                <li>Analyzing how you use our website to improve it</li>
                <li>Providing personalized content and features</li>
                <li>Ensuring the website functions properly</li>
                <li>Protecting against fraud and security threats</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Types of Cookies */}
        <section id="types-of-cookies" className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Necessary Cookies</h3>
                      <Badge className="bg-green-100 text-green-800">Always Active</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">
                      These cookies are essential for the website to function properly and cannot be disabled. 
                      They do not store any personally identifiable information.
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Purpose:</strong> Authentication, security, basic functionality
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">
                      These cookies help us understand how visitors interact with our website by 
                      collecting and reporting information anonymously.
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Purpose:</strong> Website analytics, performance monitoring, user behavior analysis
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">
                      These cookies enable enhanced functionality and personalization, such as 
                      remembering your preferences and settings.
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Purpose:</strong> User preferences, enhanced features, personalization
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    <p className="text-gray-700 mb-3">
                      These cookies are used to track visitors across websites to display relevant 
                      advertisements and measure campaign effectiveness.
                    </p>
                    <div className="text-sm text-gray-600">
                      <strong>Purpose:</strong> Advertising, marketing campaigns, social media integration
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cookie Details Table */}
        <section id="cookie-details" className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Detailed Cookie Information</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Cookie Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Purpose</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Duration</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">session_id</td>
                    <td className="border border-gray-200 px-4 py-3">Maintains user session</td>
                    <td className="border border-gray-200 px-4 py-3">Session</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge className="bg-green-100 text-green-800 text-xs">Necessary</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">auth_token</td>
                    <td className="border border-gray-200 px-4 py-3">User authentication</td>
                    <td className="border border-gray-200 px-4 py-3">30 days</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge className="bg-green-100 text-green-800 text-xs">Necessary</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">_ga</td>
                    <td className="border border-gray-200 px-4 py-3">Google Analytics tracking</td>
                    <td className="border border-gray-200 px-4 py-3">2 years</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge variant="outline" className="text-xs">Analytics</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">_gid</td>
                    <td className="border border-gray-200 px-4 py-3">Google Analytics session</td>
                    <td className="border border-gray-200 px-4 py-3">24 hours</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge variant="outline" className="text-xs">Analytics</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">theme_preference</td>
                    <td className="border border-gray-200 px-4 py-3">User interface theme</td>
                    <td className="border border-gray-200 px-4 py-3">1 year</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge variant="outline" className="text-xs">Functional</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-mono text-sm">language_preference</td>
                    <td className="border border-gray-200 px-4 py-3">Language selection</td>
                    <td className="border border-gray-200 px-4 py-3">1 year</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <Badge variant="outline" className="text-xs">Functional</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Manage Cookies */}
        <section id="manage-cookies" className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              How to Manage Your Cookie Preferences
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Cookie Banner
                </h3>
                <p className="text-gray-700 mb-3">
                  When you first visit our website, you'll see a cookie banner at the bottom of the page. 
                  You can choose to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li><strong>Accept All:</strong> Allow all types of cookies</li>
                  <li><strong>Necessary Only:</strong> Only allow essential cookies</li>
                  <li><strong>Customize:</strong> Choose specific cookie types</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-gray-600" />
                  Browser Settings
                </h3>
                <p className="text-gray-700 mb-3">
                  You can also manage cookies through your browser settings. Here's how:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Edge</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Important Note
                </h3>
                <p className="text-gray-700">
                  Disabling certain cookies may affect the functionality of our website. 
                  Necessary cookies cannot be disabled as they are essential for the website to work properly.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-blue-600" />
              Third-Party Cookies
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Our website may use third-party services that set their own cookies. 
                These services include:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Helps us understand how visitors use our website
                  </p>
                  <Link 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    Privacy Policy <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Firebase</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Provides authentication and database services
                  </p>
                  <Link 
                    href="https://firebase.google.com/support/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    Privacy Policy <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Updates and Contact */}
        <section className="mb-12">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Updates and Contact</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Policy Updates</h3>
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  material changes by posting the new Cookie Policy on this page.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-gray-700 mb-3">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@fakeverifier.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => {
              localStorage.removeItem('cookieConsent')
              window.location.reload()
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Reset Cookie Preferences
          </Button>
          <Link href="/privacy">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
