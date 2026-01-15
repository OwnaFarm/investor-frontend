"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { CropCard } from "@/components/game/crop-card"
import { SuccessModal } from "@/components/modals/success-modal"
import { WaterSuccessModal } from "@/components/modals/water-success-modal"
import { CCTVModal } from "@/components/modals/cctv-modal"
import { CropDetailModal } from "@/components/modals/crop-detail-modal"
import { motion } from "framer-motion"
import { Sprout, Droplets, Leaf, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useCropStore, useAuthStore } from "@/stores"
import { toast } from "sonner"
import type { Crop } from "@/types"

const tabs = ["all", "growing", "ready"] as const

export default function FarmPage() {
  const { t } = useLanguage()
  const { user, waterCrop: gameWaterCrop, waterAllCrops, harvestCrop: gameHarvestCrop } = useGame()
  const { token } = useAuthStore()
  const { crops, isLoading, selectedCrop, getCrops, getCropDetail, waterCrop, waterAllCrops: storeWaterAllCrops, syncHarvest } = useCropStore()
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("all")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [harvestResult, setHarvestResult] = useState({ title: "", message: "", gold: 0, xp: 0 })
  const [waterAllResult, setWaterAllResult] = useState({ title: "", message: "", water: 0, xp: 0 })
  const [showWaterAllModal, setShowWaterAllModal] = useState(false)
  const [waterResult, setWaterResult] = useState({ title: "", message: "", xp: 0 })
  const [showWaterModal, setShowWaterModal] = useState(false)
  const [cctvOpen, setCctvOpen] = useState(false)
  const [cctvCrop, setCctvCrop] = useState<Crop | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getCrops(token || '').catch((error) => {
      console.error('Failed to load crops:', error)
    })
  }, [token, getCrops])

  const filteredCrops = (crops || []).filter((crop) => {
    if (activeTab === "all") return true
    return crop.status === activeTab
  })

  const tabLabels = {
    all: t.shop.all,
    growing: t.crops.growing,
    ready: t.crops.ready,
  }

  const growingCount = (crops || []).filter((c) => c.status === "growing").length
  const readyCount = (crops || []).filter((c) => c.status === "ready").length

  const handleViewDetail = async (cropId: string) => {
    if (!token) {
      toast.error("Please sign in to view crop details")
      return
    }

    setDetailLoading(true)
    setDetailModalOpen(true)

    try {
      await getCropDetail(token, cropId)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to load crop details"
      toast.error(errorMsg)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleWater = async (cropId: string) => {
    try {
      const result = await waterCrop(token || '', cropId)
      gameWaterCrop(cropId)
      const crop = (crops || []).find((c) => c.id === cropId)
      setWaterResult({
        title: "Watered!",
        message: `${crop?.name || "Crop"} has been watered successfully!`,
        xp: result.xp_gained,
      })
      setShowWaterModal(true)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to water crop"
      toast.error(errorMsg)
    }
  }

  const handleHarvest = async (cropId: string) => {
    const crop = (crops || []).find((c) => c.id === cropId)
    if (!crop) return

    if (!token) {
      toast.error("Please sign in to harvest crops")
      return
    }

    try {
      const harvestedCrop = await syncHarvest(token, cropId)
      gameHarvestCrop(cropId)
      
      setHarvestResult({
        title: t.crops.harvested + "!",
        message: `${crop.name} has been harvested successfully!`,
        gold: harvestedCrop.harvest_amount || crop.invested,
        xp: 50,
      })
      setShowSuccessModal(true)
      setDetailModalOpen(false)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to harvest crop"
      toast.error(errorMsg)
    }
  }

  const handleWaterAll = async () => {
    try {
      const result = await storeWaterAllCrops(token || '')
      if (result.watered_count > 0) {
        setWaterAllResult({
          title: "Water All Complete!",
          message: `Successfully watered ${result.watered_count} crops`,
          water: result.watered_count,
          xp: result.xp_gained,
        })
        setShowWaterAllModal(true)
      } else {
        toast.info("No crops to water")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to water crops"
      toast.error(errorMsg)
    }
  }

  const handleViewCCTV = (cropId: string) => {
    const crop = (crops || []).find((c) => c.id === cropId)
    if (crop) {
      setCctvCrop(crop)
      setCctvOpen(true)
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
              <Leaf className="w-6 h-6 text-primary" />
              {t.home.myFarm}
            </h1>
            <p className="text-sm text-muted-foreground">
              {(crops || []).length} {t.home.activeCrops}
            </p>
          </div>
          <Button
            onClick={handleWaterAll}
            disabled={growingCount === 0}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold gap-2 cursor-pointer"
          >
            <Droplets className="w-4 h-4" />
            {t.home.waterAll}
          </Button>
        </div>

        <div className="flex gap-2">
          {tabs.map((tab) => {
            const count = tab === "growing" ? growingCount : tab === "ready" ? readyCount : (crops || []).length
            return (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-4 font-semibold transition-all gap-1",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80",
                )}
              >
                {tabLabels[tab]}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    activeTab === tab ? "bg-primary-foreground/20" : "bg-foreground/10",
                  )}
                >
                  {count}
                </span>
              </Button>
            )
          })}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCrops.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredCrops.map((crop, index) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleViewDetail(crop.id)}
                className="cursor-pointer"
              >
                <CropCard
                  id={crop.id}
                  name={crop.name}
                  image={crop.image}
                  cctvImage={crop.cctv_image}
                  location={crop.location}
                  progress={crop.progress}
                  daysLeft={crop.days_left}
                  yieldPercent={crop.yield_percent}
                  invested={crop.invested}
                  status={crop.status}
                  canWater={user.water > 0}
                  onWater={() => handleWater(crop.id)}
                  onHarvest={() => handleHarvest(crop.id)}
                  onViewCCTV={() => handleViewCCTV(crop.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="game-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2">{t.home.noActiveCrops}</p>
            <p className="text-sm text-muted-foreground mb-4">{t.home.startFarming}</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">{t.nav.shop}</Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={harvestResult.title}
        message={harvestResult.message}
        reward={{ gold: harvestResult.gold, xp: harvestResult.xp }}
      />

      <WaterSuccessModal
        isOpen={showWaterAllModal}
        onClose={() => setShowWaterAllModal(false)}
        title={waterAllResult.title}
        message={waterAllResult.message}
        reward={{ water: waterAllResult.water, xp: waterAllResult.xp }}
      />

      <WaterSuccessModal
        isOpen={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        title={waterResult.title}
        message={waterResult.message}
        reward={{ xp: waterResult.xp }}
      />

      {cctvCrop && (
        <CCTVModal
          isOpen={cctvOpen}
          onClose={() => setCctvOpen(false)}
          cropName={cctvCrop.name}
          location={cctvCrop.location || "West Java Farm, Block B"}
          imageUrl={cctvCrop.cctv_image || cctvCrop.image}
        />
      )}

      <CropDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        crop={selectedCrop}
        isLoading={detailLoading}
        onWater={selectedCrop ? () => handleWater(selectedCrop.id) : undefined}
        onHarvest={selectedCrop ? () => handleHarvest(selectedCrop.id) : undefined}
        canWater={user.water > 0}
      />
    </div>
  )
}
