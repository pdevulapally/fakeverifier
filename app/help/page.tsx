"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  Users,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Star,
  ExternalLink,
  Bot,
  FileText,
  Settings,
  CreditCard
} from "lucide-react"
import Link from "next/link"

interface FAQ {
  question: string
  answer: string
  category: string
  popular?: boolean
}

const faqs: FAQ[] = [
  {
    question: "How does FakeVerifier work?",
     answer: "FakeVerifier uses advanced AI (GPT-4o) combined with real-time news search to analyze content credibility. It cross-references your input with verified news sources, checks for inconsistencies, and provides a confidence score with detailed reasoning.",
     category: "general",
     popular: true
  },
  {
    question: "What types of content can I verify?",
    answer: "You can verify news articles, social media posts, videos, documents, and any text content. Simply paste the text, upload files, or share URLs. The system supports multiple file formats including PDF, DOC, images, and video files.",
    category: "general"
  },
  {
    question: "How accurate are the verification results?",
    answer: "Our AI achieves high accuracy by combining multiple verification methods: real-time news search, source credibility analysis, fact-checking against known databases, and pattern recognition for AI-generated content. Results include confidence scores and detailed explanations.",
    category: "accuracy",
    popular: true
  },
  {
    question: "What do the different verdicts mean?",
    answer: "• Real: Content is verified as true by multiple credible sources\n• Likely Real: Content appears true but needs additional verification\n• Questionable: Content has mixed or unclear credibility\n• Likely Fake: Content shows signs of being false\n• Fake: Content is confirmed as false\n• AI-Generated: Content appears to be created by AI",
    category: "accuracy"
  },
  {
    question: "How do tokens work?",
    answer: "Tokens are used for each verification request. Free users get 50 tokens per month, Pro users get 500 tokens, and Enterprise users get 5000 tokens. Each verification consumes 1 token. Tokens reset monthly.",
    category: "billing"
  },
  {
    question: "Can I verify content in different languages?",
    answer: "Yes! FakeVerifier supports multiple languages including English, Spanish, French, German, and more. The AI can analyze content in various languages and provide verification results accordingly.",
    category: "general"
  },
  {
    question: "How do I upload files for verification?",
    answer: "You can drag and drop files into the input area or click the paperclip icon to select files. Supported formats include PDF, DOC, DOCX, TXT, images (JPG, PNG), and video files. Maximum file size is 10MB.",
    category: "usage"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We don't store your verification content permanently, and you can delete your history at any time. We comply with GDPR and other privacy regulations.",
    category: "privacy"
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team through email at support@fakeverifier.com, use the contact form on this page, or call us directly. We typically respond within 24 hours.",
    category: "support"
  },
  {
    question: "What news sources does FakeVerifier use?",
     answer: "We integrate with multiple verified news sources to ensure comprehensive coverage and reduce bias by checking against diverse sources.",
    category: "general"
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle, count: faqs.length },
    { id: "general", name: "General", icon: Globe, count: faqs.filter(f => f.category === "general").length },
    { id: "accuracy", name: "Accuracy", icon: CheckCircle, count: faqs.filter(f => f.category === "accuracy").length },
    { id: "usage", name: "Usage", icon: Zap, count: faqs.filter(f => f.category === "usage").length },
    { id: "billing", name: "Billing", icon: CreditCard, count: faqs.filter(f => f.category === "billing").length },
    { id: "privacy", name: "Privacy", icon: Shield, count: faqs.filter(f => f.category === "privacy").length },
    { id: "support", name: "Support", icon: MessageCircle, count: faqs.filter(f => f.category === "support").length }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm)
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <Link href="/verify">
                 <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-blue-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                   <span className="hidden sm:inline">Back to Verify</span>
                   <span className="sm:hidden">Back</span>
                </Button>
              </Link>
               <div className="h-6 w-px bg-gray-300 hidden sm:block" />
               <div className="min-w-0">
                 <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Help & Support</h1>
                 <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Get help and find answers to your questions</p>
               </div>
             </div>
             <div className="flex items-center gap-2 self-end sm:self-auto">
               <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                 <span className="hidden sm:inline">All systems operational</span>
                 <span className="sm:hidden">Operational</span>
               </Badge>
              </div>
            </div>
          </div>
        </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">How can we help you?</h2>
            <p className="text-xl text-blue-100 mb-8">Find answers to common questions or get in touch with our support team.</p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                placeholder="Search for help topics, features, or troubleshooting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40"
                />
              </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm mb-4">Complete guides and tutorials</p>
              <Button variant="outline" size="sm" onClick={() => window.open('https://docs.fakeverifier.com', '_blank')}>
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with other users</p>
              <Button variant="outline" size="sm" onClick={() => window.open('https://community.fakeverifier.com', '_blank')}>
                Join Forum
              </Button>
            </CardContent>
            </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">System Status</h3>
              <p className="text-gray-600 text-sm mb-4">Check service health</p>
              <Button variant="outline" size="sm" onClick={() => window.open('https://status.fakeverifier.com', '_blank')}>
                Check Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Categories and FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                    const isSelected = selectedCategory === category.id
                  return (
                      <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                          isSelected 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {category.count}
                        </Badge>
                      </button>
                  )
                })}
              </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-gray-600">support@fakeverifier.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Frequently Asked Questions
                  {filteredFAQs.length > 0 && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {filteredFAQs.length} results
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or browse by category.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      >
                          <div className="flex items-start gap-3">
                            {faq.popular && (
                              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {faq.popular && (
                                <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                          </div>
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-4 pb-4">
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                      )}
                    </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
              </div>

                 {/* Contact Form Section */}
         <div className="mt-12">
           <div className="max-w-4xl mx-auto">
             <Card className="shadow-lg border-gray-200">
               <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                 <CardTitle className="flex items-center gap-2">
                   <Send className="w-5 h-5" />
                   Send us a Message
                 </CardTitle>
               </CardHeader>
                               <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-4">
                  <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your name"
                    />
                  </div>
                  <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your email"
                    />
                </div>
                <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter subject"
                  />
                </div>
                <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          rows={6}
                    required
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          placeholder="Enter your message here..."
                  />
                </div>
                    </div>
                                         <div className="flex justify-end pt-4">
                       <Button 
                         type="submit" 
                         className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                       >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                     </div>
              </form>
                </CardContent>
            </Card>
           </div>
         </div>

            {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 {[
                   { name: "AI Verification", status: "Operational", icon: Bot },
                   { name: "News Sources", status: "Operational", icon: Globe },
                   { name: "File Upload", status: "Operational", icon: FileText },
                   { name: "User Authentication", status: "Operational", icon: Settings }
                 ].map((service) => {
                  const Icon = service.icon
                  return (
                    <div key={service.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{service.name}</p>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                          {service.status}
                        </Badge>
                </div>
              </div>
                  )
                })}
              </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
