"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { Droplets, Clock, TrendingUp, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CropCardProps {
  id: string
  name: string
  image: string
  cctvImage?: string
  location?: string
  progress: number
  daysLeft: number
  yieldPercent: number
  invested: number
  status: "growing" | "ready" | "harvested"
  canWater?: boolean
  onWater?: () => void
  onHarvest?: () => void
  onViewCCTV?: () => void
}

export function CropCard({
  name,
  image,
  progress,
  daysLeft,
  yieldPercent,
  invested,
  status,
  canWater = true,
  onWater,
  onHarvest,
  onViewCCTV,
}: CropCardProps) {
  const { t } = useLanguage()
  const [isWatering, setIsWatering] = useState(false)
  const [showWaterDrop, setShowWaterDrop] = useState(false)

  const handleWater = () => {
    if (!canWater) return
    setIsWatering(true)
    setShowWaterDrop(true)
    setTimeout(() => {
      setIsWatering(false)
      setShowWaterDrop(false)
      onWater?.()
    }, 500)
  }

  const statusColors = {
    growing: "bg-primary/20 text-primary border-primary/30",
    ready: "bg-success/20 text-success border-success/30",
    harvested: "bg-muted text-muted-foreground border-muted",
  }

  const statusText = {
    growing: t.crops.growing,
    ready: t.crops.ready,
    harvested: t.crops.harvested,
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="game-card p-4 relative overflow-hidden"
    >
      {/* Status Badge */}
      <div
        className={cn("absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold border", statusColors[status])}
      >
        {statusText[status]}
      </div>

      {/* Crop Image */}
      <div className="relative w-full aspect-square max-w-[120px] mx-auto mb-3">
        <motion.div
          animate={isWatering ? { rotate: [0, -5, 5, -5, 0] } : {}}
          className="w-full h-full rounded-2xl bg-gradient-to-b from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden"
        >
          <img src={image || "/placeholder.svg"} alt={name} className="w-20 h-20 object-contain" />
        </motion.div>

        {/* Water Drop Animation */}
        {showWaterDrop && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 20, opacity: [0, 1, 0] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Droplets className="w-8 h-8 text-water" />
          </motion.div>
        )}
      </div>

      {/* Crop Info */}
      <h3 className="font-bold text-foreground text-center mb-2">{name}</h3>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{t.crops.progress}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              "h-full rounded-full",
              status === "ready"
                ? "bg-gradient-to-r from-success to-success/80"
                : "bg-gradient-to-r from-primary to-primary/80",
            )}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            {daysLeft} {t.crops.daysLeft}
          </span>
        </div>
        <div className="flex items-center gap-1 text-success justify-end">
          <TrendingUp className="w-3 h-3" />
          <span>+{yieldPercent}%</span>
        </div>
      </div>

      {/* Investment Amount */}
      <div className="text-center text-sm font-semibold text-secondary-foreground mb-3">
        {invested.toLocaleString()} GOLD
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {status === "growing" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1 border-accent text-accent hover:bg-accent/10 bg-transparent"
              onClick={handleWater}
              disabled={!canWater}
            >
              <Droplets className="w-4 h-4" />
              {t.crops.water}
            </Button>
            {onViewCCTV && (
              <Button
                size="sm"
                variant="outline"
                className="w-10 px-0 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewCCTV()
                }}
                title="View CCTV"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
        {status === "ready" && (
          <Button size="sm" className="flex-1 gap-1 bg-success hover:bg-success/90 text-white" onClick={onHarvest}>
            {t.crops.harvest}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
