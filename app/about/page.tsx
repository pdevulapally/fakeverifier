'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Spotlight } from '@/components/ui/spotlight';
import { BorderBeam } from '@/components/ui/border-beam';
import { CardHoverEffect } from '@/components/ui/pulse-card';
import {
  Globe,
  Users,
  Heart,
  Lightbulb,
  Sparkles,
  Rocket,
  Target,
  Shield,
  Brain,
  Search,
} from 'lucide-react';
import { Header } from '@/components/header';

interface AboutUsProps {
  title?: string;
  subtitle?: string;
  mission?: string;
  vision?: string;
  values?: Array<{
    title: string;
    description: string;
    icon: keyof typeof iconComponents;
  }>;
  className?: string;
}

const iconComponents = {
  Users: Users,
  Heart: Heart,
  Lightbulb: Lightbulb,
  Globe: Globe,
  Sparkles: Sparkles,
  Rocket: Rocket,
  Target: Target,
  Shield: Shield,
  Brain: Brain,
  Search: Search,
};

const defaultValues: AboutUsProps['values'] = [
  {
    title: 'Innovation',
    description:
      'We constantly push boundaries and explore new AI technologies to create cutting-edge misinformation detection solutions.',
    icon: 'Lightbulb',
  },
  {
    title: 'Accuracy',
    description:
      'We strive for perfection in our AI models, consistently delivering high-quality verification results with 95% detection accuracy.',
    icon: 'Sparkles',
  },
  {
    title: 'Protection',
    description:
      'We believe in safeguarding users from misleading information and propaganda through advanced AI detection capabilities.',
    icon: 'Shield',
  },
  {
    title: 'Global Impact',
    description:
      'We measure our success by the positive difference we make in combating misinformation worldwide.',
    icon: 'Globe',
  },
];

export default function AboutUs1() {
  const aboutData = {
    title: 'About FakeVerifier',
    subtitle:
      'Building the future of news verification with advanced AI technology to combat misinformation.',
    mission:
      'Our mission is to democratize news verification by providing high-quality, AI-powered tools that help users identify fake news quickly and efficiently, promoting digital literacy and critical thinking.',
    vision:
      'We envision a world where misinformation is detected and prevented in real-time, creating a more informed and resilient digital society.',
    values: defaultValues,
    className: 'relative overflow-hidden py-20',
  };

  const missionRef = useRef(null);
  const valuesRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <Header />
      <section className="relative w-full overflow-hidden pt-32">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(220, 100%, 50%, 0.08) 0, hsla(220, 100%, 55%, 0.04) 50%, hsla(220, 100%, 45%, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(220, 100%, 85%, 0.08) 0, hsla(220, 100%, 55%, 0.04) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(220, 100%, 85%, 0.06) 0, hsla(220, 100%, 85%, 0.06) 80%, transparent 100%)"
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h1 className="from-blue-600/80 via-blue-500 to-blue-600/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
              {aboutData.title}
            </h1>
            <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
              {aboutData.subtitle}
            </p>
            </motion.div>

          {/* Mission & Vision Section */}
          <div ref={missionRef} className="relative mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={
                missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative z-10 grid gap-8 lg:gap-12 lg:grid-cols-2"
            >
            <motion.div
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8 lg:p-10 backdrop-blur-3xl"
              >
                <BorderBeam
                  duration={8}
                  size={300}
                  className="via-blue-500/40 from-transparent to-transparent"
                />

                <div className="from-blue-500/20 to-blue-500/5 mb-6 inline-flex aspect-square h-16 w-16 flex-1 items-center justify-center rounded-2xl bg-gradient-to-br backdrop-blur-sm">
                  <Rocket className="text-blue-500 h-8 w-8" />
              </div>

                <div className="space-y-4">
                  <h2 className="from-blue-500/90 to-blue-500/70 mb-4 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    Our Mission
                </h2>

                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {aboutData.mission}
                  </p>
              </div>
            </motion.div>
            
            <motion.div
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-8 lg:p-10 backdrop-blur-3xl"
              >
                <BorderBeam
                  duration={8}
                  size={300}
                  className="from-transparent via-blue-500/40 to-transparent"
                  reverse
                />
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                  <Target className="h-8 w-8 text-blue-500" />
                  </div>
                  
                <h2 className="mb-4 bg-gradient-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  Our Vision
                </h2>

                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {aboutData.vision}
            </p>
          </motion.div>
            </motion.div>
          </div>

          {/* Core Values Section */}
          <div ref={valuesRef} className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              animate={
                valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-12 text-center"
            >
              <h2 className="from-blue-600/80 via-blue-500 to-blue-600/80 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
                Our Core Values
            </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
                The principles that guide everything we do and every decision we
                make in our fight against misinformation.
            </p>
          </motion.div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aboutData.values?.map((value, index) => {
                const IconComponent = iconComponents[value.icon];

                return (
            <motion.div
                    key={value.title}
              initial={{ opacity: 0, y: 30 }}
                    animate={
                      valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1 + 0.2,
                      ease: 'easeOut',
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <CardHoverEffect
                      icon={<IconComponent className="h-6 w-6" />}
                      title={value.title}
                      description={value.description}
                      variant={
                        index === 0
                          ? 'blue'
                          : index === 1
                            ? 'blue'
                            : index === 2
                              ? 'blue'
                              : 'blue'
                      }
                      glowEffect={true}
                      size="lg"
                    />
            </motion.div>
                );
              })}
          </div>
        </div>

      {/* About Creator Section */}
          <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="from-blue-600/80 via-blue-500 to-blue-600/80 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
                About the Creator
            </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
                Meet the innovative mind behind FakeVerifier, dedicated to combating misinformation through AI technology.
            </p>
          </motion.div>

            <div className="grid gap-8 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-first lg:order-last"
            >
              <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-blue-600/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-200/30 shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-pulse"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg overflow-hidden border-4 border-white">
                        <img 
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/407336793_6833926710054844_1424313180351365942_n.jpg-rQyDcOudtZtxVEZqeJi8Mc7L8a1owU.jpeg"
                          alt="Preetham Devulapally" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2">Preetham Devulapally</h3>
                        <p className="text-black text-sm sm:text-base">First Class Honours Software Engineering Graduate</p>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">University of Westminster</p>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full p-2 sm:p-3 shadow-lg">
                    <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full p-2 sm:p-3 shadow-lg">
                      <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
                <div className="space-y-6">
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4">The Vision</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed mb-4">
                    As a final year student at the University of Westminster, I recognized the growing threat of misinformation in our digital age. The Southport attack and similar events highlighted the urgent need for automated verification systems that could keep pace with the rapid spread of fake news.
                  </p>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    This project represents my commitment to leveraging cutting-edge AI technology to create a solution that not only detects misinformation but also educates users about digital literacy and critical thinking.
                  </p>
                </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-500/10 rounded-xl p-3 sm:p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-600/20 w-8 h-8 rounded-lg flex items-center justify-center">
                          <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                        <h4 className="font-semibold text-foreground text-sm">AI & Machine Learning</h4>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Specialized in artificial intelligence and machine learning technologies
                    </p>
                  </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-xl p-3 sm:p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-500/20 w-8 h-8 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-500" />
                      </div>
                        <h4 className="font-semibold text-foreground text-sm">Cybersecurity</h4>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Focused on digital security and information verification systems
                    </p>
                  </div>

                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-500/10 rounded-xl p-3 sm:p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-600/20 w-8 h-8 rounded-lg flex items-center justify-center">
                          <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                        <h4 className="font-semibold text-foreground text-sm">Social Impact</h4>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Committed to creating technology that benefits society
                    </p>
                  </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-xl p-3 sm:p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-600/20 w-8 h-8 rounded-lg flex items-center justify-center">
                          <Search className="h-4 w-4 text-blue-600" />
                      </div>
                        <h4 className="font-semibold text-foreground text-sm">Innovation</h4>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Passionate about developing innovative solutions to real-world problems
                    </p>
                  </div>
                </div>

                  <div className="bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-xl p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-foreground text-sm">Contact Information</h4>
                  </div>
                    <div className="space-y-1 text-muted-foreground text-xs sm:text-sm">
                    <p><span className="font-medium text-foreground">Email:</span> PreethamDevulapally@gmail.com</p>
                    <p><span className="font-medium text-foreground">Institution:</span> University of Westminster</p>
                    <p><span className="font-medium text-foreground">Project:</span> Final Year Dissertation</p>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
