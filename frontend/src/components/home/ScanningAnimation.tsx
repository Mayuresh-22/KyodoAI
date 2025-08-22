import { motion } from "framer-motion"
import { Scan, Zap, Sparkles, Brain } from "lucide-react"

export default function ScanningAnimation() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Main Scanning Circle */}
        <div className="relative mb-8">
          <motion.div
            className="w-40 h-40 mx-auto bg-gradient-primary rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "var(--shadow-glow)",
                "0 0 60px hsl(220 100% 56% / 0.3)",
                "var(--shadow-glow)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Scan className="w-16 h-16 text-primary-foreground" />
            </motion.div>
          </motion.div>

          {/* Orbiting Icons */}
          {[
            { icon: Brain, delay: 0, radius: 80, duration: 8 },
            { icon: Sparkles, delay: 2, radius: 80, duration: 8 },
            { icon: Zap, delay: 4, radius: 80, duration: 8 },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              animate={{
                rotate: 360,
                x: [-item.radius, -item.radius],
                y: [-item.radius, -item.radius],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "linear",
                delay: item.delay,
              }}
            >
              <item.icon className="w-4 h-4 text-secondary-foreground" />
            </motion.div>
          ))}

          {/* Pulse Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 border-2 border-primary rounded-full"
              style={{
                top: `${-ring * 20}px`,
                left: `${-ring * 20}px`,
                right: `${-ring * 20}px`,
                bottom: `${-ring * 20}px`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-4">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Scanning for Opportunities
            </motion.span>
          </h2>
          
          <div className="space-y-2 text-muted-foreground">
            {[
              "Analyzing your profile and preferences...",
              "Searching brand databases...",
              "Matching collaboration opportunities...",
              "Calculating compatibility scores...",
            ].map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.7,
                  duration: 0.5,
                }}
                className="text-sm"
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-1 mt-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}