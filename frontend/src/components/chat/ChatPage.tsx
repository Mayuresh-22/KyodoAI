import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, DollarSign, Calendar, Building } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ChatSidebar from "./ChatSidebar"

interface Message {
  id: string
  sender: "ai" | "brand" | "user"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface Deal {
  id: string
  brandName: string
  summary: string
  budget: string
  deadline: string
  type: string
  isActive: boolean
}

interface ChatPageProps {
  dealId: string
  activeDeals: Deal[]
  onNavigateToHome: () => void
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "ai",
    content: "I've initiated contact with TechFlow regarding their AI productivity suite collaboration. Here's what I've learned from their brand team:",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2", 
    sender: "brand",
    content: "Hello! We're excited about this potential collaboration. We're looking for authentic tech reviewers who can showcase our new AI-powered productivity suite to their audience. The content should focus on real-world use cases and productivity benefits.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "3",
    sender: "ai", 
    content: "Based on your profile, I believe this is an excellent match. Your tech review content and audience demographics align perfectly with their target market. I recommend we discuss the following key points:",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    suggestions: [
      "Ask about content deliverables and timeline",
      "Discuss usage rights and exclusivity", 
      "Negotiate the compensation structure",
      "Clarify product access and support"
    ]
  },
  {
    id: "4",
    sender: "user",
    content: "This looks great! Can you ask them about the specific deliverables they're expecting and whether they need video content or written reviews?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "5",
    sender: "ai",
    content: "Great question! Let me get those specifics for you. I'll also ask about their preferred timeline and any technical requirements.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  }
]

export default function ChatPage({ dealId, activeDeals, onNavigateToHome }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentDeal = activeDeals.find(deal => deal.id === dealId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "I'm processing your request and will communicate with the brand team. I'll update you with their response shortly.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion)
  }

  if (!currentDeal) {
    return (
      <div className="min-h-screen bg-gradient-automation flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Deal Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested deal doesn't exist or isn't active.
          </p>
          <GlassButton onClick={onNavigateToHome}>
            Return to Home
          </GlassButton>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex pt-20">
      {/* Sidebar */}
      <ChatSidebar 
        activeDeals={activeDeals}
        currentDealId={dealId}
        onNavigateToHome={onNavigateToHome}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto">
        {/* Header */}
        <div className="professional-glass p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">{currentDeal.brandName}</h1>
                <p className="text-sm text-foreground/70">{currentDeal.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm font-semibold text-secondary bg-secondary/10 px-4 py-2 rounded-lg">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {currentDeal.budget}
              </div>
              <div className="text-sm text-foreground/70 bg-muted px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 inline mr-1" />
                {currentDeal.deadline}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`
                  max-w-2xl flex items-start space-x-4
                  ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}
                `}>
                  {/* Avatar */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${message.sender === "ai" 
                      ? "bg-gradient-primary" 
                      : message.sender === "brand"
                      ? "bg-primary"
                      : "bg-primary"
                    }
                  `}>
                    {message.sender === "ai" && <Bot className="w-5 h-5 text-white" />}
                    {message.sender === "brand" && <Building className="w-5 h-5 text-white" />}
                    {message.sender === "user" && <User className="w-5 h-5 text-white" />}
                  </div>

                  {/* Message Content */}
                  <div className={`
                    p-6 rounded-xl max-w-lg
                    ${message.sender === "user" 
                      ? "bg-primary text-primary-foreground shadow-card" 
                      : "professional-glass"
                    }
                  `}>
                    <p className="leading-relaxed text-sm">{message.content}</p>
                    <p className="text-xs opacity-60 mt-3">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>

                    {/* AI Suggestions */}
                    {message.suggestions && (
                      <div className="mt-6 space-y-3">
                        <p className="text-sm font-bold flex items-center text-secondary">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Smart Suggestions:
                        </p>
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left p-4 professional-glass hover:bg-secondary hover:text-white rounded-lg transition-all duration-200 text-sm font-medium"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="professional-glass p-6 border-t border-border/50">
          <div className="flex space-x-4">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 professional-glass border border-border/50 rounded-xl h-12 text-sm px-6 focus:ring-2 focus:ring-secondary focus:border-secondary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}