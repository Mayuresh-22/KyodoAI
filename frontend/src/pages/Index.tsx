import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"

const Index = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background texture */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,200,200,0.1),transparent_50%)] animate-pulse delay-75"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
      </div>
      {/* Import and add navigation at the top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-secondary/10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-secondary">
              AgenticAI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <GlassButton variant="ghost" size="default" onClick={() => window.location.href = '/registration'}>
              Sign Up
            </GlassButton>
            <GlassButton variant="primary" size="default" onClick={() => window.location.href = '/home'}>
              Get Started
            </GlassButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-32 pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-40"
        >
          {/* <div className="mb-12">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 float-animation"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
           */}
          <h1 className="text-6xl md:text-8xl font-black mb-8">
            <span className="text-secondary">
              AgenticAI
            </span>
            <br />
            <span className="text-foreground font-medium">Brand Collaboration</span>
          </h1>
          
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-16 leading-relaxed">
            AI agents that discover, negotiate, and manage brand partnerships. 
            Focus on creating while we handle the business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => window.location.href = '/registration'}
              className="bg-gradient-primary text-white px-12 py-5 text-xl font-bold rounded-xl shadow-glow hover:shadow-float transition-all duration-300 flex items-center gap-3 mx-auto group"
            >
              Start Collaborating
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <button
              onClick={() => window.location.href = '/home'}
              className="bg-primary text-primary-foreground px-12 py-5 text-xl font-bold rounded-xl hover:bg-primary/90 transition-all duration-300"
            >
              View Demo
            </button> */}
          </div>
        </motion.div>

        {/* Features Grid - Minimal and Clean */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: Brain,
              title: "AI Discovery",
              description: "Intelligent matching with brands aligned to your content and audience."
            },
            {
              icon: Zap,
              title: "Auto Negotiations",
              description: "AI handles contract discussions and pricing while you create."
            },
            {
              icon: Sparkles,
              title: "Seamless Management",
              description: "Track collaborations with real-time updates and automated workflows."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <GlassCard className="p-8 text-center h-full hover:shadow-float transition-all bg-white/95 border border-secondary/10">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">{feature.title}</h3>
                <p className="text-foreground/70 text-base leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Illustrative Section with Dark Theme */}
        <div className="relative py-32 w-screen bg-black text-white overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff10,transparent_25%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,#ffffff10,transparent_25%)]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Experience the Future of Brand Partnerships
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  Our AI-powered platform revolutionizes how creators and brands connect, negotiate, and collaborate. Step into a world where partnerships are seamless and success is automated.
                </p>
                <div className="space-y-4">
                  {[
                    "Advanced AI matching algorithms",
                    "Automated negotiation processes",
                    "Real-time analytics and insights",
                    "Smart contract management"
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative z-10"
                >
                  <div className="w-full h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffffff08,transparent_60%)]"></div>
                    {/* Add some mock interface elements */}
                    <div className="space-y-4">
                      <div className="w-1/2 h-6 bg-white/5 rounded-lg"></div>
                      <div className="w-3/4 h-4 bg-white/5 rounded-lg"></div>
                      <div className="w-2/3 h-4 bg-white/5 rounded-lg"></div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="h-20 bg-white/5 rounded-xl"></div>
                        <div className="h-20 bg-white/5 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="absolute -inset-4 bg-gradient-to-r from-white/0 via-white/5 to-white/0 blur-3xl -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-16 max-w-3xl mx-auto bg-white/95 border border-secondary/10 mt-32">
            <h2 className="text-5xl font-bold mb-8 text-secondary bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
              Ready to Transform Your Collaborations?
            </h2>
            <p className="text-xl text-foreground/70 mb-12 max-w-xl mx-auto leading-relaxed">
              Join creators who've automated partnerships and increased earnings.
            </p>
            <button
              onClick={() => window.location.href = '/registration'}
              className="bg-black text-white px-12 py-4 text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto group"
            >
              Get Started Free
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
