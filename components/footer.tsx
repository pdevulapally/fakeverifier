import { Shield, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Mobile Layout - Single Column, Centered */}
        <div className="md:hidden">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/Images/FakeVerifierwhiteLogo.png" 
                alt="FakeVerifier Logo" 
                className="h-24 w-auto md:h-32 md:w-auto object-contain"
              />
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 text-sm">
              Empowering truth through AI-powered news verification. Join thousands of professionals who trust
              FakeVerifier.
            </p>
            <div className="flex justify-center gap-6 mb-8">
              <a 
                href="https://github.com/pdevulapally/fakeverifier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/preethamdevulapally/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Mobile Navigation - Stacked Vertically */}
          <div className="space-y-6 mb-8">
            <div className="text-center">
              <h4 className="font-serif font-bold mb-3 text-lg">Product</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="/features" className="hover:text-white transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors text-sm">
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <h4 className="font-serif font-bold mb-3 text-lg">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="/help" className="hover:text-white transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors text-sm">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors text-sm">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/Images/FakeVerifierwhiteLogo.png" 
                alt="FakeVerifier Logo" 
                className="h-32 w-auto object-contain"
              />
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              Empowering truth through AI-powered news verification. Join thousands of professionals who trust
              FakeVerifier.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/pdevulapally/fakeverifier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/preethamdevulapally/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Responsive */}
        <div className="border-t border-slate-700 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-slate-400 text-sm md:text-base">© 2024 FakeVerifier. All rights reserved.</p>
            <p className="text-slate-400 text-sm md:text-base">Powered by advanced AI technology</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
