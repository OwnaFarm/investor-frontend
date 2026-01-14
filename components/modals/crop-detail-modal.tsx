"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, TrendingUp, MapPin, Droplets, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Crop } from "@/types"

interface CropDetailModalProps {
  isOpen: boolean
  onClose: () => void
  crop: Crop | null
  isLoading: boolean
  onWater?: () => void
  onHarvest?: () => void
  canWater?: boolean
}

export function CropDetailModal({
  isOpen,
  onClose,
  crop,
  isLoading,
  onWater,
  onHarvest,
  canWater = true,
}: CropDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const statusColors = {
    growing: "bg-primary/20 text-primary border-primary/30",
    ready: "bg-green-500/20 text-green-500 border-green-500/30",
    harvested: "bg-muted text-muted-foreground border-muted",
  }

  const statusText = {
    growing: "Growing",
    ready: "Ready to Harvest",
    harvested: "Harvested",
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-9999 px-4 pointer-events-none"
          >
            <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Crop Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : crop ? (
                <div className="space-y-4">
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                    <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={crop.image || "/placeholder.svg"}
                        alt={crop.name}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold border ${statusColors[crop.status]}`}
                    >
                      {statusText[crop.status]}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-foreground">{crop.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{crop.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{crop.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          crop.status === "ready"
                            ? "bg-green-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${crop.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Days Left</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{crop.days_left}</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">Yield</span>
                      </div>
                      <p className="text-lg font-bold text-green-500">+{crop.yield_percent}%</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Droplets className="w-4 h-4" />
                        <span className="text-xs">Water Count</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{crop.water_count}</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Planted</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(crop.planted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Investment</p>
                    <p className="text-xl font-bold text-foreground">
                      {crop.invested.toLocaleString()} GOLD
                    </p>
                  </div>

                  {crop.status === "growing" && onWater && (
                    <Button
                      onClick={onWater}
                      disabled={!canWater}
                      className="w-full h-12 font-bold cursor-pointer gap-2"
                    >
                      <Droplets className="w-5 h-5" />
                      Water Crop
                    </Button>
                  )}

                  {crop.status === "ready" && onHarvest && (
                    <Button
                      onClick={onHarvest}
                      className="w-full h-12 font-bold cursor-pointer gap-2 bg-green-500 hover:bg-green-600"
                    >
                      Harvest Now
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Crop not found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
