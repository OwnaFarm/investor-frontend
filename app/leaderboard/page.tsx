"use client"

import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LeaderboardItem } from "@/components/game/leaderboard-item"
import { motion } from "framer-motion"
import { Trophy, Crown, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const mockLeaderboard = [
  { rank: 1, username: "MasterFarmer", avatar: "👨‍🌾", level: 45, earnings: 125000 },
  { rank: 2, username: "GreenThumb", avatar: "👩‍🌾", level: 42, earnings: 98500 },
  { rank: 3, username: "CropKing", avatar: "🧑‍🌾", level: 38, earnings: 87200 },
  { rank: 4, username: "HarvestQueen", avatar: "👸", level: 35, earnings: 76800 },
  { rank: 5, username: "SeedMaster", avatar: "🌱", level: 33, earnings: 65400 },
  { rank: 6, username: "FarmLord", avatar: "🤴", level: 30, earnings: 54200 },
  { rank: 7, username: "PlantWhiz", avatar: "🧙", level: 28, earnings: 43100 },
  { rank: 9, username: "CropNinja", avatar: "🥷", level: 25, earnings: 38900 },
  { rank: 10, username: "GardenGuru", avatar: "🧘", level: 23, earnings: 32100 },
]

const periods = ["weekly", "monthly", "allTime"] as const

export default function LeaderboardPage() {
  const { t } = useLanguage()
  const { user } = useGame()
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("weekly")

  const periodLabels = {
    weekly: t.leaderboard.weekly,
    monthly: t.leaderboard.monthly,
    allTime: t.leaderboard.allTime,
  }

  const currentUserEntry = {
    rank: 8,
    username: user.name,
    avatar: user.avatar,
    level: user.level,
    earnings: user.gold,
    isCurrentUser: true,
  }

  // Combine mock data with current user
  const fullLeaderboard = [...mockLeaderboard.slice(0, 7), currentUserEntry, ...mockLeaderboard.slice(7)].sort(
    (a, b) => a.rank - b.rank,
  )

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
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-2">
            <Trophy className="w-5 h-5 text-secondary" />
            <h1 className="text-xl font-bold text-foreground">{t.leaderboard.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{t.leaderboard.subtitle}</p>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 justify-center">
          {periods.map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="sm"
              onClick={() => setActivePeriod(period)}
              className={cn(
                "rounded-full px-4 font-semibold transition-all",
                activePeriod === period
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80",
              )}
            >
              {periodLabels[period]}
            </Button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-2 py-4">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl border-4 border-gray-200 shadow-lg">
              {mockLeaderboard[1].avatar}
            </div>
            <Medal className="w-6 h-6 text-gray-400 -mt-2" />
            <p className="text-xs font-bold mt-1 truncate max-w-[70px]">{mockLeaderboard[1].username}</p>
            <div className="h-16 w-16 bg-gray-200 rounded-t-lg mt-1 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">2</span>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center -mx-2 z-10"
          >
            <Crown className="w-8 h-8 text-yellow-500 mb-1" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl border-4 border-yellow-300 shadow-xl">
              {mockLeaderboard[0].avatar}
            </div>
            <p className="text-sm font-bold mt-2 truncate max-w-[80px]">{mockLeaderboard[0].username}</p>
            <div className="h-24 w-20 bg-yellow-200 rounded-t-lg mt-1 flex items-center justify-center">
              <span className="text-2xl font-bold text-yellow-600">1</span>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl border-4 border-amber-400 shadow-lg">
              {mockLeaderboard[2].avatar}
            </div>
            <Medal className="w-6 h-6 text-amber-600 -mt-2" />
            <p className="text-xs font-bold mt-1 truncate max-w-[70px]">{mockLeaderboard[2].username}</p>
            <div className="h-12 w-16 bg-amber-200 rounded-t-lg mt-1 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-700">3</span>
            </div>
          </motion.div>
        </div>

        {/* Current User Position */}
        <div className="game-card p-3 border-primary/50">
          <p className="text-xs text-muted-foreground mb-2 text-center">{t.leaderboard.you}</p>
          <LeaderboardItem {...currentUserEntry} isCurrentUser />
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">{t.leaderboard.top100}</h3>
          {fullLeaderboard.slice(3).map((item) => (
            <LeaderboardItem key={item.rank} {...item} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
