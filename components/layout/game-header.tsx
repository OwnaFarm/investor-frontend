"use client"

import { useLanguage } from "@/contexts/language-context"
import { Coins, Droplets, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface GameHeaderProps {
  gold?: number
  water?: number
  xp?: number
  level?: number
  username?: string
  avatar?: string
}

export function GameHeader({
  gold = 1250,
  water = 45,
  xp = 2340,
  level = 12,
  username = "Farmer",
  avatar = "👨‍🌾",
}: GameHeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b-2 border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo & User Info */}
        <div className="flex items-center gap-3">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg border-2 border-secondary"
          >
            <span className="text-xl">{avatar}</span>
            <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
              {level}
            </div>
          </motion.div>
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground font-medium">{t.home.welcome}</p>
            <p className="text-sm font-bold text-foreground">{username}</p>
          </div>
        </div>

        {/* Currency Stats */}
        <div className="flex items-center gap-2">
          {/* Gold */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-secondary/20 rounded-full px-3 py-1.5 border border-secondary/30"
          >
            <Coins className="w-4 h-4 text-gold" />
            <span className="text-sm font-bold text-secondary-foreground">{gold.toLocaleString()}</span>
          </motion.div>

          {/* Water */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-accent/20 rounded-full px-3 py-1.5 border border-accent/30"
          >
            <Droplets className="w-4 h-4 text-water" />
            <span className="text-sm font-bold text-accent-foreground">{water}</span>
          </motion.div>

          {/* XP (hidden on small screens) */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center gap-1.5 bg-xp/20 rounded-full px-3 py-1.5 border border-xp/30"
          >
            <Sparkles className="w-4 h-4 text-xp" />
            <span className="text-sm font-bold" style={{ color: "var(--xp)" }}>
              {xp.toLocaleString()}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
