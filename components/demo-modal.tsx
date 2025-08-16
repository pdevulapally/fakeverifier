"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Globe,
  Search,
  BarChart3,
  FileText
} from "lucide-react"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

const demoSteps = [
  {
    id: 1,
    title: "Upload Content",
    description: "Simply paste a news article URL or upload content to begin verification",
    icon: FileText,
    image: "/news-verification-dashboard.png",
    features: ["URL Analysis", "Content Upload", "Real-time Processing"]
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Our advanced AI analyzes credibility, sources, and detects potential misinformation",
    icon: Zap,
    image: "/news-verification-dashboard.png",
    features: ["Credibility Scoring", "Source Verification", "Bias Detection"]
  },
  {
    id: 3,
    title: "Detailed Results",
    description: "Get comprehensive reports with evidence, sources, and recommendations",
    icon: BarChart3,
    image: "/news-verification-dashboard.png",
    features: ["Evidence Mapping", "Source Analysis", "Actionable Insights"]
  },
  {
    id: 4,
    title: "Share & Collaborate",
    description: "Share verification results with your team or community",
    icon: Globe,
    image: "/news-verification-dashboard.png",
    features: ["Result Sharing", "Team Collaboration", "Export Options"]
  }
]

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleClose = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    onClose()
  }

  const currentDemoStep = demoSteps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Product Demo
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left side - Demo content */}
          <div className="flex-1 p-6">
            <div className="relative">
              {/* Demo image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-100 border">
                <div className="bg-gray-200 h-8 flex items-center px-4 border-b">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-sm text-gray-600">
                    FakeVerifier Dashboard
                  </div>
                </div>
                <img 
                  src={currentDemoStep.image} 
                  alt={currentDemoStep.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Step content */}
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <currentDemoStep.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentDemoStep.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentDemoStep.description}
                    </p>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2">
                  {currentDemoStep.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Controls and progress */}
          <div className="lg:w-80 p-6 bg-gray-50 border-l">
            <div className="space-y-6">
              {/* Progress indicator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep + 1} of {demoSteps.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentStep + 1) / demoSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Playback controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === demoSteps.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Step navigation */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Demo Steps</h4>
                {demoSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentStep === index
                        ? 'bg-blue-100 border-blue-300 border'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.id}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4 border-t">
                <Button
                  onClick={handleClose}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Start verifying content in seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
