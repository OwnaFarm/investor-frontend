"use client"

import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { CropCard } from "@/components/game/crop-card"
import { DailyRewardBanner } from "@/components/game/daily-reward-banner"
import { SuccessModal } from "@/components/modals/success-modal"
import { motion } from "framer-motion"
import { ChevronRight, Sprout, TrendingUp, Droplets } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function HomePage() {
  const { t } = useLanguage()
  const { user, crops, waterCrop, waterAllCrops, harvestCrop, earnGold } = useGame()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [harvestResult, setHarvestResult] = useState({ title: "", message: "", gold: 0, xp: 0 })

  const displayCrops = crops.slice(0, 2)
  const readyCount = crops.filter((c) => c.status === "ready").length
  const growingCount = crops.filter((c) => c.status === "growing").length

  const handleWater = (cropId: string) => {
    waterCrop(cropId)
  }

  const handleHarvest = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId)
    if (!crop) return

    const earnings = harvestCrop(cropId)
    setHarvestResult({
      title: t.crops.harvested + "!",
      message: `${crop.name} has been harvested successfully!`,
      gold: earnings,
      xp: 50,
    })
    setShowSuccessModal(true)
  }

  const handleWaterAll = () => {
    waterAllCrops()
  }

  const handleClaimDailyReward = () => {
    earnGold(50)
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
        {/* Daily Reward Banner */}
        <DailyRewardBanner canClaim={true} rewardAmount={50} onClaim={handleClaimDailyReward} />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} className="game-card p-3 text-center">
            <Sprout className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold text-foreground">{crops.length}</p>
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

        {/* My Farm Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">{t.home.myFarm}</h2>
            <Link href="/farm">
              <Button variant="ghost" size="sm" className="text-primary font-semibold">
                {t.home.viewAll}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {displayCrops.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {displayCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CropCard
                    {...crop}
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
                <Button className="bg-primary hover:bg-primary/90">{t.nav.shop}</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Water All Button */}
        {growingCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={handleWaterAll}
              disabled={user.water < growingCount}
              className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <Droplets className="w-5 h-5" />
              {t.home.waterAll} ({growingCount} crops)
            </Button>
          </motion.div>
        )}
      </main>

      <BottomNav />

      {/* Success Modal */}
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
