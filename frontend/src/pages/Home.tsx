import { useState } from "react"
import HomePage from "@/components/home/HomePage"

interface Deal {
  id: string
  brandName: string
  summary: string
  budget: string
  deadline: string
  type: string
  isActive: boolean
}

export default function Home() {
  const [activeDeals, setActiveDeals] = useState<Deal[]>([])

  const handleDealActivate = (deal: Deal) => {
    setActiveDeals(prev => {
      const exists = prev.find(d => d.id === deal.id)
      if (exists) {
        return prev.map(d => d.id === deal.id ? deal : d)
      }
      return [...prev, deal]
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Sidebar for Active Deals */}
      {activeDeals.length > 0 && (
        <div className="fixed left-0 top-0 h-screen w-80 bg-white/95 border-r border-secondary/10 p-6 pt-24 shadow-lg backdrop-blur-lg">
          <h3 className="text-xl font-semibold text-secondary mb-6">Active Chats</h3>
          <div className="space-y-3">
            {activeDeals.map((deal) => (
              <div 
                key={deal.id}
                onClick={() => window.location.href = `/chat/${deal.id}`}
                className="p-4 bg-white shadow-sm border border-secondary/10 rounded-xl cursor-pointer hover:bg-secondary/5 hover:shadow-md transition-all duration-200"
              >
                <div className="font-medium text-base text-secondary mb-1">{deal.brandName}</div>
                <div className="text-sm text-secondary/60 line-clamp-2">{deal.summary}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1">
        <HomePage 
          onDealActivate={handleDealActivate}
          activeDeals={activeDeals}
        />
      </div>
    </div>
  )
}