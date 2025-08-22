import { motion } from "framer-motion"
import { Home, MessageCircle, Building } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"

interface Deal {
  id: string
  brandName: string
  summary: string
  budget: string
  deadline: string
  type: string
  isActive: boolean
}

interface ChatSidebarProps {
  activeDeals: Deal[]
  currentDealId: string
  onNavigateToHome: () => void
}

export default function ChatSidebar({ activeDeals, currentDealId, onNavigateToHome }: ChatSidebarProps) {
  return (
    <div className="w-80 professional-glass border-r border-border/50 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-secondary mb-2">Active Chats</h2>
        <p className="text-sm text-foreground/60 mb-6">{activeDeals.length} collaboration{activeDeals.length !== 1 ? 's' : ''}</p>
        <button
          onClick={onNavigateToHome}
          className="w-full flex items-center justify-start gap-3 p-3 professional-glass hover:bg-secondary hover:text-white rounded-xl transition-all duration-200 font-medium"
        >
          <Home className="w-5 h-5" />
          Back to Opportunities
        </button>
      </div>

      {/* Active Deals List */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {activeDeals.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground/70 text-sm font-medium">
              No active chats yet.
            </p>
          </div>
        ) : (
          activeDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => window.location.href = `/chat/${deal.id}`}
                className={`
                  p-5 rounded-xl cursor-pointer transition-all text-left w-full
                  ${deal.id === currentDealId 
                    ? "bg-gradient-primary text-white shadow-glow" 
                    : "professional-glass hover:shadow-card border border-border/50"
                  }
                `}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 flex-shrink-0" />
                    <span className={`font-bold text-sm truncate ${
                      deal.id === currentDealId ? "text-white" : "text-secondary"
                    }`}>
                      {deal.brandName}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${
                    deal.id === currentDealId ? "text-white/80" : "text-foreground/70"
                  }`}>
                    {deal.summary}
                  </p>
                  <div className={`flex justify-between text-xs font-semibold ${
                    deal.id === currentDealId ? "text-white" : "text-secondary"
                  }`}>
                    <span>{deal.budget.split(' - ')[0]}</span>
                    <span>{deal.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="text-xs text-foreground/50 text-center">
          <p className="mb-1 font-bold text-secondary">AgenticAI</p>
          <p>AI collaboration agent</p>
        </div>
      </div>
    </div>
  )
}