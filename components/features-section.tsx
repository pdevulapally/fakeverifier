import { Brain, Zap, Shield, BarChart3, Globe, Users } from "lucide-react"

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI-Driven Analysis",
    description:
      "Advanced machine learning algorithms analyze multiple data points to assess news credibility with unprecedented accuracy.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Credibility Scores",
    description: "Get real-time credibility ratings from 0-100 within seconds of submitting any news article or claim.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Source Verification",
    description: "Cross-reference claims with trusted databases and fact-checking organizations worldwide.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Detailed Reports",
    description:
      "Comprehensive analysis reports showing bias detection, source reliability, and factual accuracy metrics.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Language Support",
    description: "Verify news credibility in over 50 languages with culturally-aware analysis algorithms.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Share verification results with your team and build a collaborative fact-checking workflow.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-14 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-serif mt-4 text-3xl font-bold tracking-tighter text-slate-800 sm:text-4xl md:text-5xl">
              Powerful Features for Truth Verification
            </h3>
            <p className="font-sans text-slate-600 mt-3 text-xl leading-relaxed">
              Our comprehensive suite of AI-powered tools helps you navigate the complex landscape of modern
              information.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(59, 130, 246, 0.2) 4.54%, rgba(37, 99, 235, 0.26) 34.2%, rgba(59, 130, 246, 0.1) 77.55%)",
            }}
          ></div>
        </div>
        <hr className="bg-slate-300 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border border-slate-200 bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#3b82f62f_inset] hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-blue-600 w-fit transform-gpu rounded-full border border-slate-200 p-4 bg-blue-50 [box-shadow:0_-20px_80px_-20px_#3b82f63f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-serif text-lg font-semibold tracking-tighter text-slate-800">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
