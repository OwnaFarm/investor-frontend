"use client"

import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SeedCard } from "@/components/game/seed-card"
import { BuySeedModal } from "@/components/modals/buy-seed-modal"
import { SuccessModal } from "@/components/modals/success-modal"
import { motion } from "framer-motion"
import { Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const mockSeeds = [
  {
    id: "1",
    name: "Cabai Premium",
    image: "/red-chili-seed-packet-cartoon.jpg",
    price: 500,
    yieldPercent: 18,
    duration: 30,
    offtaker: "PT. Indofood",
    targetFund: 50000,
    funded: 35000,
    risk: "low" as const,
    badge: "hot" as const,
  },
  {
    id: "2",
    name: "Jagung Manis",
    image: "/corn-seed-packet-cartoon-cute.jpg",
    price: 300,
    yieldPercent: 15,
    duration: 45,
    offtaker: "PT. Mayora",
    targetFund: 30000,
    funded: 28000,
    risk: "low" as const,
    badge: "new" as const,
  },
  {
    id: "3",
    name: "Kopi Arabika",
    image: "/coffee-bean-seed-packet-cartoon.jpg",
    price: 1000,
    yieldPercent: 25,
    duration: 90,
    offtaker: "PT. Kapal Api",
    targetFund: 100000,
    funded: 45000,
    risk: "medium" as const,
  },
  {
    id: "4",
    name: "Bawang Merah",
    image: "/onion-seed-packet-cartoon.jpg",
    price: 400,
    yieldPercent: 20,
    duration: 60,
    offtaker: "PT. ABC Food",
    targetFund: 40000,
    funded: 40000,
    risk: "low" as const,
    badge: "limited" as const,
  },
  {
    id: "5",
    name: "Tomat Cherry",
    image: "/tomato-seed-packet-cartoon-cute.jpg",
    price: 250,
    yieldPercent: 12,
    duration: 25,
    offtaker: "PT. Heinz",
    targetFund: 25000,
    funded: 12000,
    risk: "low" as const,
  },
  {
    id: "6",
    name: "Kentang Organik",
    image: "/potato-seed-packet-cartoon.jpg",
    price: 600,
    yieldPercent: 22,
    duration: 75,
    offtaker: "PT. Lays",
    targetFund: 80000,
    funded: 20000,
    risk: "medium" as const,
    badge: "new" as const,
  },
  {
    id: "7",
    name: "Selada Hidroponik",
    image: "/cctv-sayur-selada.png",
    cctvImage: "/cctv-sayur-selada.png",
    location: "GreenHouse Lembang, Bandung Barat",
    price: 350,
    yieldPercent: 16,
    duration: 21,
    offtaker: "PT. Sayurbox",
    targetFund: 35000,
    funded: 28000,
    risk: "low" as const,
    badge: "hot" as const,
  },
]

const filters = ["all", "featured", "lowRisk", "mediumRisk"] as const

export default function ShopPage() {
  const { t } = useLanguage()
  const { user, spendGold, addCrop, earnXp } = useGame()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all")
  const [selectedSeed, setSelectedSeed] = useState<(typeof mockSeeds)[0] | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedQuantity, setPurchasedQuantity] = useState(0)

  const filteredSeeds = mockSeeds.filter((seed) => {
    if (activeFilter === "all") return true
    if (activeFilter === "featured") return seed.badge === "hot" || seed.badge === "new"
    if (activeFilter === "lowRisk") return seed.risk === "low"
    if (activeFilter === "mediumRisk") return seed.risk === "medium"
    return true
  })

  const filterLabels = {
    all: t.shop.all,
    featured: t.shop.featured,
    lowRisk: t.shop.lowRisk,
    mediumRisk: t.shop.mediumRisk,
  }

  const handleBuyClick = (seed: (typeof mockSeeds)[0]) => {
    setSelectedSeed(seed)
    setShowBuyModal(true)
  }

  const handleConfirmPurchase = (quantity: number) => {
    if (!selectedSeed) return

    const totalCost = selectedSeed.price * quantity
    const success = spendGold(totalCost)

    if (success) {
      // Add crops for each quantity purchased
      for (let i = 0; i < quantity; i++) {
        addCrop({
          name: selectedSeed.name,
          image: selectedSeed.image,
          cctvImage: (selectedSeed as { cctvImage?: string }).cctvImage,
          location: (selectedSeed as { location?: string }).location,
          progress: 0,
          daysLeft: selectedSeed.duration,
          yieldPercent: selectedSeed.yieldPercent,
          invested: selectedSeed.price,
          status: "growing",
        })
      }
      earnXp(quantity * 10)
      setPurchasedQuantity(quantity)
      setShowBuyModal(false)
      setShowSuccessModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <GameHeader
        username={user.name}
        level={user.level}
        gold={user.gold}
        water={user.water}
        xp={user.xp}
        avatar={user.avatar}
      />

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-secondary" />
              {t.shop.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.shop.subtitle}</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-4 whitespace-nowrap font-semibold transition-all",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              {filterLabels[filter]}
            </Button>
          ))}
        </div>

        {/* Seeds Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredSeeds.map((seed, index) => (
            <motion.div
              key={seed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SeedCard {...seed} onBuy={() => handleBuyClick(seed)} />
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />

      {/* Buy Modal */}
      {selectedSeed && (
        <BuySeedModal
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          onConfirm={handleConfirmPurchase}
          seed={selectedSeed}
          userGold={user.gold}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Purchase Successful!"
        message={`You bought ${purchasedQuantity}x ${selectedSeed?.name || "seeds"}`}
        reward={{ xp: purchasedQuantity * 10 }}
      />
    </div>
  )
}
