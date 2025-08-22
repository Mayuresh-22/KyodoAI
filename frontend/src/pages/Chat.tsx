import { useState } from "react"
import { useParams } from "react-router-dom"
import ChatPage from "@/components/chat/ChatPage"

interface Deal {
  id: string
  brandName: string
  summary: string
  budget: string
  deadline: string
  type: string
  isActive: boolean
}

// Mock data - in a real app this would come from a global state or API
const mockActiveDeals: Deal[] = [
  {
    id: "1",
    brandName: "TechFlow",
    summary: "Looking for tech reviewers to showcase our new AI-powered productivity suite",
    budget: "$2,500 - $5,000",
    deadline: "2 weeks",
    type: "Product Review",
    isActive: true
  },
  {
    id: "2", 
    brandName: "EcoLife",
    summary: "Sustainable lifestyle brand seeking authentic content creators for eco-friendly products",
    budget: "$1,500 - $3,000",
    deadline: "3 weeks", 
    type: "Lifestyle Content",
    isActive: true
  },
  {
    id: "3",
    brandName: "FitnessPro",
    summary: "New fitness app launch - need fitness influencers for workout demonstration videos",
    budget: "$3,000 - $7,500",
    deadline: "1 week",
    type: "Fitness Demo",
    isActive: true
  }
]

export default function Chat() {
  const { dealId } = useParams<{ dealId: string }>()
  const [activeDeals] = useState<Deal[]>(mockActiveDeals)

  const handleNavigateToHome = () => {
    window.location.href = "/home"
  }

  return (
    <ChatPage 
      dealId={dealId || ""}
      activeDeals={activeDeals}
      onNavigateToHome={handleNavigateToHome}
    />
  )
}