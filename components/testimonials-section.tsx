import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Journalist",
    company: "Global News Network",
    content:
      "FakeVerifier has revolutionized our fact-checking process. The AI analysis is incredibly accurate and saves us hours of manual verification work.",
    rating: 5,
    avatar: "/professional-woman-journalist.png",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Research Director",
    company: "Digital Media Institute",
    content:
      "The detailed credibility reports provide exactly the kind of analysis we need for our research. The multi-language support is particularly impressive.",
    rating: 5,
    avatar: "/professional-man-researcher.png",
  },
  {
    name: "Emma Thompson",
    role: "Editor-in-Chief",
    company: "TechToday Magazine",
    content:
      "Our entire editorial team relies on FakeVerifier daily. The team collaboration features have streamlined our verification workflow significantly.",
    rating: 5,
    avatar: "/professional-woman-editor.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 mb-6">Trusted by Professionals</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See what journalists, researchers, and content creators are saying about FakeVerifier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">"{testimonial.content}"</p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
