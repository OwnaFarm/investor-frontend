"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Thermometer, Droplets, Wind, Camera, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CCTVModalProps {
  isOpen: boolean
  onClose: () => void
  cropName: string
  location: string
  imageUrl?: string
}

export function CCTVModal({ isOpen, onClose, cropName, location, imageUrl }: CCTVModalProps) {
  // Mock sensor data that updates slightly
  const [sensors, setSensors] = useState({
    temp: 28,
    humidity: 65,
    moisture: 42
  })

  useEffect(() => {
    if (!isOpen) return
    
    const interval = setInterval(() => {
      setSensors(prev => ({
        temp: +(prev.temp + (Math.random() * 0.4 - 0.2)).toFixed(1),
        humidity: Math.min(100, Math.max(0, Math.round(prev.humidity + (Math.random() * 2 - 1)))),
        moisture: Math.min(100, Math.max(0, Math.round(prev.moisture + (Math.random() * 2 - 1))))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isOpen])

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-center h-full pointer-events-none"
          >
            <div className="bg-card rounded-3xl w-full max-w-lg border border-border shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-none">Live Monitor</h2>
                    <span className="text-xs text-muted-foreground">Real-time Field Data</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="overflow-y-auto p-4 space-y-4">
                {/* Camera Feed */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border group">
                  <img 
                    src={imageUrl || "https://images.unsplash.com/photo-1625246333195-9818e0f17793?q=80&w=1000&auto=format&fit=crop"} 
                    alt="Live Feed" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  
                  {/* Live Indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-bold shadow-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    LIVE
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-mono text-xs opacity-80">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                        <p className="font-semibold text-sm">{cropName} - Cam #04</p>
                      </div>
                      <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Scanlines Effect (Optional Visual Flair) */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_3px,3px_100%]" />
                </div>

                {/* Location Info */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Farm Location</h3>
                    <p className="text-xs text-muted-foreground">{location}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">LAT: -6.2088 LON: 106.8456</p>
                  </div>
                </div>

                {/* Sensor Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center shadow-sm">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span className="text-xl font-bold">{sensors.temp}°C</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Temp</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center shadow-sm">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-xl font-bold">{sensors.humidity}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Humidity</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center shadow-sm">
                    <Wind className="w-5 h-5 text-green-500" />
                    <span className="text-xl font-bold">{sensors.moisture}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Soil Moist</span>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-border bg-muted/10">
                <Button className="w-full" onClick={onClose}>
                  Close Monitor
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
