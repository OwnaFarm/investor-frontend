"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { Gift, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DailyRewardBannerProps {
  canClaim?: boolean
  rewardAmount?: number
  onClaim?: () => void
}

export function DailyRewardBanner({ canClaim = true, rewardAmount = 50, onClaim }: DailyRewardBannerProps) {
  const { t } = useLanguage()
  const [claimed, setClaimed] = useState(false)

  const handleClaim = () => {
    if (!canClaim || claimed) return
    setClaimed(true)
    onClaim?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/30 via-secondary/20 to-gold/20 border-2 border-secondary/30 p-4"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={
              canClaim && !claimed
                ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5, repeat: canClaim && !claimed ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 }}
            className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center"
          >
            <Gift className="w-6 h-6 text-secondary-foreground" />
          </motion.div>
          <div>
            <h3 className="font-bold text-foreground">{t.home.dailyReward}</h3>
            <p className="text-sm text-muted-foreground">+{rewardAmount} GOLD</p>
          </div>
        </div>

        <Button
          onClick={handleClaim}
          disabled={!canClaim || claimed}
          className={
            claimed
              ? "bg-muted text-muted-foreground"
              : "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
          }
        >
          {claimed ? "Claimed!" : t.home.claimReward}
          {!claimed && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </motion.div>
  )
}
