"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { CropCard } from "@/components/game/crop-card"
import { DailyRewardBanner } from "@/components/game/daily-reward-banner"
import { FaucetClaimCard } from "@/components/game/faucet-claim-card"
import { SuccessModal } from "@/components/modals/success-modal"
import { motion } from "framer-motion"
import { ChevronRight, Sprout, TrendingUp, Droplets, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCropStore, useAuthStore } from "@/stores"
import { toast } from "sonner"

export default function HomePage() {
  const { t } = useLanguage()
  const { user, waterCrop: gameWaterCrop, waterAllCrops, harvestCrop: gameHarvestCrop, earnGold } = useGame()
  const { token } = useAuthStore()
  const { crops, isLoading, getCrops, waterCrop, syncHarvest } = useCropStore()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [harvestResult, setHarvestResult] = useState({ title: "", message: "", gold: 0, xp: 0 })

  useEffect(() => {
    if (token) {
      getCrops(token).catch((error) => {
        console.error('Failed to load crops:', error)
      })
    }
  }, [token, getCrops])

  const displayCrops = (crops || []).slice(0, 2)
  const readyCount = (crops || []).filter((c) => c.status === "ready").length
  const growingCount = (crops || []).filter((c) => c.status === "growing").length

  const handleWater = async (cropId: string) => {
    if (!token) {
      toast.error("Please sign in to water crops")
      return
    }

    try {
      const result = await waterCrop(token, cropId)
      gameWaterCrop(cropId)
      toast.success(`Gained ${result.xp_gained} XP! Water remaining: ${result.water_remaining}`)
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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to harvest crop"
      toast.error(errorMsg)
    }
  }

  const handleWaterAll = () => {
    waterAllCrops()
  }

  const handleClaimDailyReward = () => {
    earnGold(10000)
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

      <main className="px-4 py-4 max-w-lg mx-auto space-y-6">
        <DailyRewardBanner canClaim={true} rewardAmount={10000} onClaim={handleClaimDailyReward} />

        <FaucetClaimCard />

        <div className="grid grid-cols-3 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} className="game-card p-3 text-center">
            <Sprout className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold text-foreground">{(crops || []).length}</p>
            <p className="text-xs text-muted-foreground">{t.home.activeCrops}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="game-card p-3 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-success" />
            <p className="text-xl font-bold text-foreground">{readyCount}</p>
            <p className="text-xs text-muted-foreground">{t.home.readyToHarvest}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="game-card p-3 text-center">
            <Droplets className="w-6 h-6 mx-auto mb-1 text-water" />
            <p className="text-xl font-bold text-foreground">{user.water}</p>
            <p className="text-xs text-muted-foreground">{t.stats.water}</p>
          </motion.div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">{t.home.myFarm}</h2>
            <Link href="/farm">
              <Button variant="ghost" size="sm" className="text-primary font-semibold cursor-pointer">
                {t.home.viewAll}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : displayCrops.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {displayCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                <Button className="bg-primary hover:bg-primary/90 cursor-pointer">{t.nav.shop}</Button>
              </Link>
            </div>
          )}
        </section>

        {growingCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={handleWaterAll}
              disabled={user.water < growingCount}
              className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground gap-2 cursor-pointer"
            >
              <Droplets className="w-5 h-5" />
              {t.home.waterAll} ({growingCount} crops)
            </Button>
          </motion.div>
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
    </div>
  )
}
