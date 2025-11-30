"use client"

import { motion } from "framer-motion"
import { Crown, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardItemProps {
  rank: number
  username: string
  avatar?: string
  level: number
  earnings: number
  isCurrentUser?: boolean
}

export function LeaderboardItem({
  rank,
  username,
  avatar,
  level,
  earnings,
  isCurrentUser = false,
}: LeaderboardItemProps) {
  const getRankStyle = () => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50"
    if (rank === 2) return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/50"
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50"
    return "bg-card border-border"
  }

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
        getRankStyle(),
        isCurrentUser && "ring-2 ring-primary ring-offset-2",
      )}
    >
      {/* Rank */}
      <div className="w-8 h-8 flex items-center justify-center">{getRankIcon()}</div>

      {/* Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-lg">
          {avatar || "👨‍🌾"}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-black px-1 rounded-full">
          {level}
        </div>
      </div>

      {/* Username */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-bold truncate", isCurrentUser ? "text-primary" : "text-foreground")}>
          {username}
          {isCurrentUser && " (You)"}
        </p>
      </div>

      {/* Earnings */}
      <div className="text-right">
        <p className="font-bold text-secondary-foreground">{earnings.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">GOLD</p>
      </div>
    </motion.div>
  )
}
