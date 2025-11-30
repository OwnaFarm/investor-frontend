"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Building2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SeedCardProps {
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
  badge?: "new" | "hot" | "limited"
  onBuy?: () => void
}

export function SeedCard({
  name,
  image,
  price,
  yieldPercent,
  duration,
  offtaker,
  targetFund,
  funded,
  risk,
  badge,
  onBuy,
}: SeedCardProps) {
  const { t } = useLanguage()

  const fundedPercent = Math.round((funded / targetFund) * 100)
  const isSoldOut = fundedPercent >= 100

  const riskColors = {
    low: "bg-success/20 text-success",
    medium: "bg-secondary/50 text-secondary-foreground",
    high: "bg-destructive/20 text-destructive",
  }

  const riskText = {
    low: t.shop.lowRisk,
    medium: t.shop.mediumRisk,
    high: t.shop.highRisk,
  }

  const badgeColors = {
    new: "bg-accent text-accent-foreground",
    hot: "bg-destructive text-destructive-foreground",
    limited: "bg-secondary text-secondary-foreground",
  }

  const badgeText = {
    new: t.shop.new,
    hot: t.shop.hot,
    limited: t.shop.limited,
  }

  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} className="game-card p-4 relative">
      {/* Badge */}
      {badge && <Badge className={cn("absolute top-3 left-3 font-bold", badgeColors[badge])}>{badgeText[badge]}</Badge>}

      {/* Risk Badge */}
      <div className={cn("absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold", riskColors[risk])}>
        {riskText[risk]}
      </div>

      {/* Seed Image */}
      <div className="w-full aspect-square max-w-[100px] mx-auto mb-3 mt-4">
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0] }}
          className="w-full h-full rounded-2xl bg-gradient-to-b from-primary/10 to-primary/5 flex items-center justify-center p-4"
        >
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Seed Info */}
      <h3 className="font-bold text-foreground text-center mb-1">{name}</h3>

      {/* Offtaker */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
        <Building2 className="w-3 h-3" />
        <span>{offtaker}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1.5">
          <TrendingUp className="w-3 h-3 text-success" />
          <span className="font-semibold text-success">+{yieldPercent}%</span>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1.5">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="font-semibold">
            {duration} {t.time.days}
          </span>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {t.shop.funded}
          </span>
          <span>{fundedPercent}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fundedPercent}%` }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn(
              "h-full rounded-full",
              isSoldOut ? "bg-muted-foreground" : "bg-gradient-to-r from-primary to-success",
            )}
          />
        </div>
      </div>

      {/* Price & Buy Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{t.shop.price}</p>
          <p className="font-bold text-secondary-foreground">
            {price.toLocaleString()} <span className="text-xs">GOLD</span>
          </p>
        </div>
        <Button
          size="sm"
          onClick={onBuy}
          disabled={isSoldOut}
          className={cn(
            "px-4 font-bold",
            isSoldOut ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground",
          )}
        >
          {isSoldOut ? t.shop.soldOut : t.shop.buyNow}
        </Button>
      </div>
    </motion.div>
  )
}
