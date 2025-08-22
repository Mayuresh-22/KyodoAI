import { motion } from "framer-motion"
import { MessageCircle, Calendar, DollarSign } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
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

interface OpportunitiesSidebarProps {
  activeDeals: Deal[]
  onDealSelect: (dealId: string) => void
  selectedDealId?: string
}

export default function OpportunitiesSidebar({ 
  activeDeals, 
  onDealSelect, 
  selectedDealId 
}: OpportunitiesSidebarProps) {
  return (
    <div className="w-80 bg-white/95 border-r border-secondary/20 p-4 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-secondary mb-1">Active Chats</h2>
        <p className="text-xs text-secondary/60">
          {activeDeals.length} active collaboration{activeDeals.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Active Deals List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {activeDeals.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
            <p className="text-secondary/50 text-sm">
              No active chats yet. Return to opportunities to start collaborations.
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
              <GlassCard
                className={`
                  p-3 cursor-pointer transition-all hover:shadow-float
                  ${selectedDealId === deal.id 
                    ? "bg-gradient-primary text-white border-secondary" 
                    : "bg-white/80 hover:bg-white/90 border-secondary/20"
                  }
                `}
                onClick={() => onDealSelect(deal.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{deal.brandName}</h3>
                    <div className="w-2 h-2 bg-secondary/50 rounded-full"></div>
                  </div>
                  
                  <p className={`text-xs line-clamp-2 ${
                    selectedDealId === deal.id ? "text-white/90" : "text-secondary/70"
                  }`}>
                    {deal.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className={`flex items-center ${
                      selectedDealId === deal.id ? "text-white/80" : "text-secondary/60"
                    }`}>
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>{deal.budget.split(' - ')[0]}</span>
                    </div>
                    <div className={`flex items-center ${
                      selectedDealId === deal.id ? "text-white/80" : "text-secondary/60"
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{deal.deadline}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-secondary/20">
        <div className="text-xs text-secondary/50 text-center">
          <p className="mb-1">AgenticAI</p>
          <p>AI-powered collaboration agent</p>
        </div>
      </div>
    </div>
  )
}