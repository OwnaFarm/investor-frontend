"use client"

import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LeaderboardItem } from "@/components/game/leaderboard-item"
import { motion } from "framer-motion"
import { Trophy, Crown, Medal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import { useLeaderboardStore, useAuthStore } from "@/stores"
import type { LeaderboardType, LeaderboardEntry } from "@/types"
import { toast } from "sonner"

const leaderboardTypes: LeaderboardType[] = ["xp", "wealth", "profit"]

const formatWalletAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getScoreLabel = (type: LeaderboardType): string => {
  switch (type) {
    case "xp":
      return "XP"
    case "wealth":
      return "GOLD"
    case "profit":
      return "GOLD"
    default:
      return "GOLD"
  }
}

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const { user } = useGame()
  const { token } = useAuthStore()
  const { entries, userEntry, isLoading, error, getLeaderboard } = useLeaderboardStore()
  const [activeType, setActiveType] = useState<LeaderboardType>("xp")

  const typeLabels: Record<LeaderboardType, string> = {
    xp: "XP",
    wealth: t.leaderboard.monthly,
    profit: t.leaderboard.allTime,
  }

  const fetchLeaderboard = useCallback(async (type: LeaderboardType) => {
    if (!token) return
    try {
      await getLeaderboard(token, { type, limit: 100 })
    } catch {
      toast.error("Failed to load leaderboard")
    }
  }, [token, getLeaderboard])

  useEffect(() => {
    fetchLeaderboard(activeType)
  }, [activeType, fetchLeaderboard])

  const handleTypeChange = (type: LeaderboardType) => {
    setActiveType(type)
  }

  const topThree = entries.slice(0, 3)
  const restEntries = entries.slice(3)

  const currentUserDisplay: LeaderboardEntry | null = userEntry || entries.find(e => e.is_current_user) || null

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
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-2">
            <Trophy className="w-5 h-5 text-secondary" />
            <h1 className="text-xl font-bold text-foreground">{t.leaderboard.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{t.leaderboard.subtitle}</p>
        </div>

        <div className="flex gap-2 justify-center">
          {leaderboardTypes.map((type) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => handleTypeChange(type)}
              className={cn(
                "rounded-full px-4 font-semibold transition-all cursor-pointer",
                activeType === type
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              {typeLabels[type]}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Unable to load leaderboard</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLeaderboard(activeType)}
              className="mt-4 cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leaderboard data available</p>
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <>
            <div className="flex items-end justify-center gap-2 py-4">
              {topThree[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xs font-mono border-4 border-muted-foreground/20 shadow-lg">
                    {formatWalletAddress(topThree[1].wallet_address)}
                  </div>
                  <Medal className="w-6 h-6 text-gray-400 -mt-2" />
                  <p className="text-xs font-bold mt-1 truncate max-w-[70px]">
                    {formatWalletAddress(topThree[1].wallet_address)}
                  </p>
                  <div className="h-16 w-16 bg-muted rounded-t-lg mt-1 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">2</span>
                  </div>
                </motion.div>
              )}

              {topThree[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center -mx-2 z-10"
                >
                  <Crown className="w-8 h-8 text-yellow-500 mb-1" />
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-xs font-mono border-4 border-primary/50 shadow-xl">
                    {formatWalletAddress(topThree[0].wallet_address)}
                  </div>
                  <p className="text-sm font-bold mt-2 truncate max-w-[80px]">
                    {formatWalletAddress(topThree[0].wallet_address)}
                  </p>
                  <div className="h-24 w-20 bg-primary/20 rounded-t-lg mt-1 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                </motion.div>
              )}

              {topThree[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xs font-mono border-4 border-amber-600/30 shadow-lg">
                    {formatWalletAddress(topThree[2].wallet_address)}
                  </div>
                  <Medal className="w-6 h-6 text-amber-600 -mt-2" />
                  <p className="text-xs font-bold mt-1 truncate max-w-[70px]">
                    {formatWalletAddress(topThree[2].wallet_address)}
                  </p>
                  <div className="h-12 w-16 bg-amber-600/20 rounded-t-lg mt-1 flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-700">3</span>
                  </div>
                </motion.div>
              )}
            </div>

            {currentUserDisplay && (
              <div className="game-card p-3 border-primary/50">
                <p className="text-xs text-muted-foreground mb-2 text-center">{t.leaderboard.you}</p>
                <LeaderboardItem
                  rank={currentUserDisplay.rank}
                  username={formatWalletAddress(currentUserDisplay.wallet_address)}
                  level={0}
                  earnings={currentUserDisplay.score}
                  isCurrentUser
                />
              </div>
            )}

            {restEntries.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">{t.leaderboard.top100}</h3>
                {restEntries.map((entry) => (
                  <LeaderboardItem
                    key={entry.rank}
                    rank={entry.rank}
                    username={formatWalletAddress(entry.wallet_address)}
                    level={0}
                    earnings={entry.score}
                    isCurrentUser={entry.is_current_user}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
