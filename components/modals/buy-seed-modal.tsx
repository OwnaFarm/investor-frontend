"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, TrendingUp, Clock, Target, Minus, Plus, Coins, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface BuySeedModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (quantity: number) => void
  seed: {
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
  }
  userGold: number
}

export function BuySeedModal({ isOpen, onClose, onConfirm, seed, userGold }: BuySeedModalProps) {
  const { t } = useLanguage()
  const [quantity, setQuantity] = useState(1)

  const totalCost = seed.price * quantity
  const expectedReturn = Math.round(totalCost * (1 + seed.yieldPercent / 100))
  const profit = expectedReturn - totalCost
  const canAfford = userGold >= totalCost
  const maxQuantity = Math.floor(userGold / seed.price)

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

  const handleConfirm = () => {
    if (canAfford) {
      onConfirm(quantity)
      setQuantity(1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card rounded-t-3xl p-6 max-w-lg mx-auto border-t-4 border-primary">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Seed Image & Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center p-2">
                  <img
                    src={seed.image || "/placeholder.svg"}
                    alt={seed.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{seed.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{seed.offtaker}</span>
                  </div>
                  <div
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-2",
                      riskColors[seed.risk],
                    )}
                  >
                    {riskText[seed.risk]}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="game-card p-3 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                  <p className="text-lg font-bold text-success">+{seed.yieldPercent}%</p>
                  <p className="text-xs text-muted-foreground">{t.shop.yield}</p>
                </div>
                <div className="game-card p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold text-foreground">{seed.duration}</p>
                  <p className="text-xs text-muted-foreground">{t.time.days}</p>
                </div>
                <div className="game-card p-3 text-center">
                  <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-foreground">
                    {Math.round((seed.funded / seed.targetFund) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">{t.shop.funded}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="game-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{t.shop.invest}</span>
                  <span className="text-sm text-muted-foreground">Max: {maxQuantity}</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-full bg-transparent"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-center min-w-[100px]">
                    <p className="text-3xl font-bold text-foreground">{quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      {seed.price.toLocaleString()} GOLD {t.shop.price.toLowerCase()}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                    className="rounded-full bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="game-card p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.shop.price}</span>
                  <span className="font-semibold">{totalCost.toLocaleString()} GOLD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.shop.expectedReturn}</span>
                  <span className="font-semibold text-success">{expectedReturn.toLocaleString()} GOLD</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Profit</span>
                  <span className="font-bold text-success">+{profit.toLocaleString()} GOLD</span>
                </div>
              </div>

              {/* Balance Warning */}
              {!canAfford && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Insufficient GOLD balance</span>
                </div>
              )}

              {/* Current Balance */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Your Balance</span>
                </div>
                <span className="font-bold text-foreground">{userGold.toLocaleString()} GOLD</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  {t.common.cancel}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!canAfford}
                  className="flex-1 bg-primary hover:bg-primary/90 font-bold"
                >
                  {t.common.confirm} ({totalCost.toLocaleString()} GOLD)
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
