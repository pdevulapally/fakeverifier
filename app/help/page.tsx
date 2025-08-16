"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
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
  Send
} from "lucide-react"
import Link from "next/link"

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    question: "How does FakeVerifier work?",
    answer: "FakeVerifier uses advanced AI (GPT-4o) combined with real-time news search across multiple APIs to analyze content credibility. It cross-references your input with verified news sources, checks for inconsistencies, and provides a confidence score with detailed reasoning.",
    category: "general"
  },
  {
    question: "What types of content can I verify?",
    answer: "You can verify news articles, social media posts, videos, documents, and any text content. Simply paste the text, upload files, or share URLs. The system supports multiple file formats including PDF, DOC, images, and video files.",
    category: "general"
  },
  {
    question: "How accurate are the verification results?",
    answer: "Our AI achieves high accuracy by combining multiple verification methods: real-time news search, source credibility analysis, fact-checking against known databases, and pattern recognition for AI-generated content. Results include confidence scores and detailed explanations.",
    category: "accuracy"
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
    answer: "You can reach our support team through email at support@fakeverifier.com, use the contact form on this page, or join our community Discord for real-time help. We typically respond within 24 hours.",
    category: "support"
  },
  {
    question: "What news sources does FakeVerifier use?",
    answer: "We integrate with multiple news APIs including News API, NewsAPI.ai, Finlight, and NYT Top Stories. This ensures comprehensive coverage and reduces bias by checking against diverse sources.",
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
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "general", name: "General", icon: Globe },
    { id: "accuracy", name: "Accuracy", icon: CheckCircle },
    { id: "usage", name: "Usage", icon: Zap },
    { id: "billing", name: "Billing", icon: Shield },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "support", name: "Support", icon: MessageCircle }
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
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/verify">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Verify
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
                <p className="text-sm text-gray-500">Get help and find answers to your questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search */}
            <Card className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  )
                })}
              </div>
            </Card>

            {/* FAQs */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No questions found matching your search.</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <div key={index} className="border rounded-lg">
                      <button
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-first xl:order-last">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-3 flex-col items-start"
                  onClick={() => window.open('https://docs.fakeverifier.com', '_blank')}
                >
                  <BookOpen className="w-5 h-5 mb-2 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Documentation</div>
                    <div className="text-xs text-gray-500 mt-1">Complete guides & tutorials</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-3 flex-col items-start"
                  onClick={() => window.open('https://community.fakeverifier.com', '_blank')}
                >
                  <Users className="w-5 h-5 mb-2 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Community Forum</div>
                    <div className="text-xs text-gray-500 mt-1">Connect with users</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-3 flex-col items-start"
                  onClick={() => window.open('https://discord.gg/fakeverifier', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mb-2 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Discord Server</div>
                    <div className="text-xs text-gray-500 mt-1">Real-time support</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-3 flex-col items-start"
                  onClick={() => window.open('https://status.fakeverifier.com', '_blank')}
                >
                  <Shield className="w-5 h-5 mb-2 text-orange-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">System Status</div>
                    <div className="text-xs text-gray-500 mt-1">Check service health</div>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-gray-500">support@fakeverifier.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Discord Community</p>
                    <p className="text-xs text-gray-500">Join our community</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-xs text-gray-500">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Form */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* System Status */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Verification</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">News APIs</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Upload</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Authentication</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
