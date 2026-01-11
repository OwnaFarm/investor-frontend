"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Crop {
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
  plantedAt: Date
}

interface UserProfile {
  name: string
  avatar: string
  wallet: string
  level: number
  xp: number
  gold: number
  water: number
}

interface GameState {
  user: UserProfile
  crops: Crop[]
  updateUser: (data: Partial<UserProfile>) => void
  addCrop: (crop: Omit<Crop, "id" | "plantedAt">) => void
  waterCrop: (cropId: string) => void
  waterAllCrops: () => void
  harvestCrop: (cropId: string) => number
  spendGold: (amount: number) => boolean
  earnGold: (amount: number) => void
  earnXp: (amount: number) => void
}

const GameContext = createContext<GameState | undefined>(undefined)

const initialCrops: Crop[] = [
  {
    id: "1",
    name: "Cabai Indofood",
    image: "/red-chili-pepper-plant-cartoon.jpg",
    progress: 65,
    daysLeft: 12,
    yieldPercent: 18,
    invested: 500,
    status: "growing",
    plantedAt: new Date(),
  },
  {
    id: "2",
    name: "Jagung Mayora",
    image: "/corn-plant-cartoon-cute.jpg",
    progress: 100,
    daysLeft: 0,
    yieldPercent: 15,
    invested: 300,
    status: "ready",
    plantedAt: new Date(),
  },
  {
    id: "3",
    name: "Kopi Arabika",
    image: "/coffee-plant-cartoon.jpg",
    progress: 30,
    daysLeft: 63,
    yieldPercent: 25,
    invested: 1000,
    status: "growing",
    plantedAt: new Date(),
  },
  {
    id: "4",
    name: "Bawang Merah",
    image: "/onion-plant-cartoon.jpg",
    progress: 100,
    daysLeft: 0,
    yieldPercent: 20,
    invested: 400,
    status: "ready",
    plantedAt: new Date(),
  },
  {
    id: "5",
    name: "Tomat Cherry",
    image: "/tomato-plant-cartoon-cute.jpg",
    progress: 45,
    daysLeft: 14,
    yieldPercent: 12,
    invested: 250,
    status: "growing",
    plantedAt: new Date(),
  },
  {
    id: "6",
    name: "Selada Hidroponik",
    image: "/cctv-sayur-selada.png",
    cctvImage: "/cctv-sayur-selada.png",
    location: "GreenHouse Lembang, Bandung Barat",
    progress: 75,
    daysLeft: 7,
    yieldPercent: 16,
    invested: 350,
    status: "growing",
    plantedAt: new Date(),
  },
]

const initialUser: UserProfile = {
  name: "Juragan",
  avatar: "👨‍🌾",
  wallet: "0x1234...5678",
  level: 12,
  xp: 2340,
  gold: 1250,
  water: 45,
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(initialUser)
  const [crops, setCrops] = useState<Crop[]>(initialCrops)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("ownafarm_user")
    const savedCrops = localStorage.getItem("ownafarm_crops")

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch { }
    }
    if (savedCrops) {
      try {
        setCrops(JSON.parse(savedCrops))
      } catch { }
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ownafarm_user", JSON.stringify(user))
    }
  }, [user, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ownafarm_crops", JSON.stringify(crops))
    }
  }, [crops, mounted])

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }))
  }

  const addCrop = (crop: Omit<Crop, "id" | "plantedAt">) => {
    const newCrop: Crop = {
      ...crop,
      id: Date.now().toString(),
      plantedAt: new Date(),
    }
    setCrops((prev) => [...prev, newCrop])
  }

  const waterCrop = (cropId: string) => {
    if (user.water <= 0) return

    setCrops((prev) =>
      prev.map((crop) => {
        if (crop.id === cropId && crop.status === "growing") {
          const newProgress = Math.min(100, crop.progress + 5)
          const isReady = newProgress >= 100
          return {
            ...crop,
            progress: newProgress,
            status: isReady ? "ready" : "growing",
            daysLeft: isReady ? 0 : Math.max(0, crop.daysLeft - 1),
          }
        }
        return crop
      }),
    )
    setUser((prev) => ({ ...prev, water: prev.water - 1 }))
  }

  const waterAllCrops = () => {
    const growingCrops = crops.filter((c) => c.status === "growing")
    const waterNeeded = growingCrops.length

    if (user.water < waterNeeded) return

    setCrops((prev) =>
      prev.map((crop) => {
        if (crop.status === "growing") {
          const newProgress = Math.min(100, crop.progress + 5)
          const isReady = newProgress >= 100
          return {
            ...crop,
            progress: newProgress,
            status: isReady ? "ready" : "growing",
            daysLeft: isReady ? 0 : Math.max(0, crop.daysLeft - 1),
          }
        }
        return crop
      }),
    )
    setUser((prev) => ({ ...prev, water: prev.water - waterNeeded }))
  }

  const harvestCrop = (cropId: string): number => {
    const crop = crops.find((c) => c.id === cropId)
    if (!crop || crop.status !== "ready") return 0

    const earnings = Math.round(crop.invested * (1 + crop.yieldPercent / 100))

    setCrops((prev) => prev.filter((c) => c.id !== cropId))
    setUser((prev) => ({
      ...prev,
      gold: prev.gold + earnings,
      xp: prev.xp + 50,
    }))

    return earnings
  }

  const spendGold = (amount: number): boolean => {
    if (user.gold < amount) return false
    setUser((prev) => ({ ...prev, gold: prev.gold - amount }))
    return true
  }

  const earnGold = (amount: number) => {
    setUser((prev) => ({ ...prev, gold: prev.gold + amount }))
  }

  const earnXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount
      const xpForNextLevel = prev.level * 300
      if (newXp >= xpForNextLevel) {
        return { ...prev, xp: newXp - xpForNextLevel, level: prev.level + 1 }
      }
      return { ...prev, xp: newXp }
    })
  }

  return (
    <GameContext.Provider
      value={{
        user,
        crops,
        updateUser,
        addCrop,
        waterCrop,
        waterAllCrops,
        harvestCrop,
        spendGold,
        earnGold,
        earnXp,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
