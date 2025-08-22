import { motion } from "framer-motion"
import { Brain, Home, MessageCircle, User, Settings } from "lucide-react"
import { useLocation } from "react-router-dom"
import { GlassButton } from "@/components/ui/glass-button"

export default function Navigation() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary">
              AgenticAI
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <GlassButton 
              variant={isActive('/') ? "primary" : "ghost"}
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </GlassButton>
            
            <GlassButton 
              variant={isActive('/home') ? "primary" : "ghost"}
              size="sm"
              onClick={() => window.location.href = '/home'}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Opportunities
            </GlassButton>
            
            <GlassButton 
              variant={isActive('/registration') ? "primary" : "ghost"}
              size="sm"
              onClick={() => window.location.href = '/registration'}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </GlassButton>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <GlassButton 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex"
            >
              <Settings className="w-4 h-4" />
            </GlassButton>
            
            <GlassButton 
              variant="primary" 
              size="sm"
              onClick={() => window.location.href = '/registration'}
            >
              Get Started
            </GlassButton>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}