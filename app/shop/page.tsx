"use client"

import { useEffect, useState, useCallback } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SeedCard } from "@/components/game/seed-card"
import { BuySeedModal } from "@/components/modals/buy-seed-modal"
import { SuccessModal } from "@/components/modals/success-modal"
import { motion } from "framer-motion"
import { Filter, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCropStore, useAuthStore, useMarketplaceStore } from "@/stores"
import { toast } from "sonner"
import type { MarketplaceInvoice } from "@/types"

type SeedData = {
  id: string
  name: string
  image: string
  price: number
  yieldPercent: number
  duration: number
  offtaker: string
  targetFund: number
  funded: number
  risk: "low" | "medium" | "high"
  badge?: "hot" | "new" | "limited"
  cctvImage?: string
  location?: string
  description?: string
}

const filters = ["all", "featured", "lowRisk", "mediumRisk"] as const

function mapInvoiceToSeed(invoice: MarketplaceInvoice): SeedData {
  const yieldPercent = parseFloat(invoice.yield_percent)
  const risk: "low" | "medium" | "high" = yieldPercent <= 15 ? "low" : yieldPercent <= 20 ? "medium" : "high"
  const fundingProgress = invoice.funding_progress
  const badge: "hot" | "new" | "limited" | undefined = 
    fundingProgress >= 80 ? "limited" : 
    fundingProgress <= 30 ? "new" : 
    yieldPercent >= 18 ? "hot" : undefined

  return {
    id: invoice.id,
    name: invoice.name,
    image: invoice.image_url,
    price: parseFloat(invoice.target_fund),
    yieldPercent,
    duration: invoice.duration_days,
    offtaker: invoice.farmer_name,
    targetFund: parseFloat(invoice.target_fund),
    funded: parseFloat(invoice.total_funded),
    risk,
    badge,
    cctvImage: invoice.farm_cctv_image,
    location: invoice.farm_location,
    description: invoice.description,
  }
}

export default function ShopPage() {
  const { t } = useLanguage()
  const { user, spendGold, addCrop, earnXp } = useGame()
  const { token } = useAuthStore()
  const { syncCrops, getCrops, addMockCrop } = useCropStore()
  const { invoices, isLoading, getInvoices } = useMarketplaceStore()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all")
  const [selectedSeed, setSelectedSeed] = useState<SeedData | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedQuantity, setPurchasedQuantity] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchInvoices = useCallback(async () => {
    try {
      await getInvoices(token || '', { limit: 20, sort_by: 'yield_percent', sort_order: 'desc' })
    } catch (error) {
      console.error("Failed to load marketplace items:", error)
    }
  }, [token, getInvoices])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const seeds: SeedData[] = (invoices || []).map(mapInvoiceToSeed)

  const filteredSeeds = seeds.filter((seed) => {
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

  const handleBuyClick = (seed: SeedData) => {
    setSelectedSeed(seed)
    setShowBuyModal(true)
  }

  const handleSyncInvestments = async (txHash?: string) => {
    if (!token) {
      toast.error("Please sign in to sync investments")
      return
    }

    setIsSyncing(true)
    try {
      const result = await syncCrops(token, txHash)
      
      if (result.synced_count > 0) {
        toast.success(`Synced ${result.synced_count} investment(s) from blockchain`)
        await getCrops(token)
      } else {
        toast.info("No new investments to sync")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to sync investments"
      toast.error(errorMsg)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleConfirmPurchase = async (quantity: number) => {
    if (!selectedSeed) return

    const totalCost = selectedSeed.price * quantity
    const success = spendGold(totalCost)

    if (success) {
      for (let i = 0; i < quantity; i++) {
        addMockCrop({
          name: selectedSeed.name,
          image: selectedSeed.image,
          cctvImage: selectedSeed.cctvImage,
          location: selectedSeed.location,
          price: selectedSeed.price,
          yieldPercent: selectedSeed.yieldPercent,
          duration: selectedSeed.duration,
        })
        
        addCrop({
          name: selectedSeed.name,
          image: selectedSeed.image,
          cctvImage: selectedSeed.cctvImage,
          location: selectedSeed.location,
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
      
      toast.success(`Successfully purchased ${quantity}x ${selectedSeed.name}`)

      if (token) {
        await handleSyncInvestments()
      }
    } else {
      toast.error("Not enough gold to complete purchase")
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-secondary" />
              {t.shop.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.shop.subtitle}</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl bg-transparent cursor-pointer">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-4 whitespace-nowrap font-semibold transition-all cursor-pointer",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              {filterLabels[filter]}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No items available</p>
          </div>
        ) : (
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
        )}
      </main>

      <BottomNav />

      {selectedSeed && (
        <BuySeedModal
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          onConfirm={handleConfirmPurchase}
          seed={selectedSeed}
          userGold={user.gold}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={isSyncing ? "Syncing..." : "Purchase Successful!"}
        message={isSyncing ? "Syncing your investment from blockchain..." : `You bought ${purchasedQuantity}x ${selectedSeed?.name || "seeds"}`}
        reward={{ xp: purchasedQuantity * 10 }}
      />
    </div>
  )
}
