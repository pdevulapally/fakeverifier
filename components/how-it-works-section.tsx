import { Upload, Search, CheckCircle, Shield } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 mb-6">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our streamlined AI-powered process makes news verification simple, fast, and reliable.
          </p>
        </div>

        <div className="mx-auto my-8 grid w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="scale-in group visible cursor-pointer" style={{ transform: "translateY(0px) scale(1)" }}>
            <div
              className="relative transform overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)), url(/placeholder.svg?height=400&width=600&query=news%20articles%20on%20digital%20screen)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-medium text-white">Submit Content</h3>
                <p className="mb-4 font-sans text-sm text-white/80">
                  Paste URL, upload text, or enter news content for verification
                </p>
                <div className="flex items-center text-white/60">
                  <div className="mr-1 h-4 w-4 rounded-full bg-green-400"></div>
                  <span className="font-sans text-xs">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scale-in group visible cursor-pointer" style={{ transform: "translateY(0px) scale(1)" }}>
            <div
              className="relative transform overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)), url(/placeholder.svg?height=400&width=600&query=AI%20analysis%20data%20visualization)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-medium text-white">AI Analysis</h3>
                <p className="mb-4 font-sans text-sm text-white/80">
                  Advanced algorithms analyze against multiple fact-checking sources
                </p>
                <div className="flex items-center text-white/60">
                  <div className="mr-1 h-4 w-4 rounded-full bg-blue-400"></div>
                  <span className="font-sans text-xs">Multi-source verification</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scale-in group visible cursor-pointer" style={{ transform: "translateY(0px) scale(1)" }}>
            <div
              className="relative transform overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)), url(/placeholder.svg?height=400&width=600&query=credibility%20score%20dashboard%20results)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-medium text-white">Get Results</h3>
                <p className="mb-4 font-sans text-sm text-white/80">
                  Comprehensive credibility score with detailed explanations
                </p>
                <div className="flex items-center text-white/60">
                  <div className="mr-1 h-4 w-4 rounded-full bg-green-400"></div>
                  <span className="font-sans text-xs">Instant results</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scale-in group visible cursor-pointer" style={{ transform: "translateY(0px) scale(1)" }}>
            <div
              className="relative transform overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)), url(/placeholder.svg?height=400&width=600&query=trust%20verification%20shield%20protection)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-medium text-white">Trust & Share</h3>
                <p className="mb-4 font-sans text-sm text-white/80">
                  Share verified results and build informed communities
                </p>
                <div className="flex items-center text-white/60">
                  <div className="mr-1 h-4 w-4 rounded-full bg-blue-400"></div>
                  <span className="font-sans text-xs">Community verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
