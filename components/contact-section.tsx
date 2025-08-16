import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 mb-6">Get in Touch</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about FakeVerifier? We're here to help you get started with reliable news verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-slate-800">Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <Input placeholder="John" className="border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <Input placeholder="Doe" className="border-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <Input type="email" placeholder="john@example.com" className="border-slate-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <Input placeholder="Your Company" className="border-slate-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us about your verification needs..."
                    className="border-slate-300 min-h-[120px]"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-sky-500 text-white" size="lg">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Email</div>
                    <div className="text-slate-600">support@fakeverifier.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Phone</div>
                    <div className="text-slate-600">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Address</div>
                    <div className="text-slate-600">
                      123 Innovation Drive
                      <br />
                      San Francisco, CA 94105
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-serif font-bold text-slate-800 mb-3">Enterprise Solutions</h4>
              <p className="text-slate-600 mb-4">
                Need a custom solution for your organization? Our enterprise team can help you implement FakeVerifier at
                scale.
              </p>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-100 bg-transparent">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
