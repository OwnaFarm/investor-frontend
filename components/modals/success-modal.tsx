"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  reward?: {
    gold?: number
    xp?: number
  }
}

export function SuccessModal({ isOpen, onClose, title, message, reward }: SuccessModalProps) {
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#84cc16", "#eab308", "#f97316"],
      })
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-card rounded-3xl p-8 max-w-sm w-full border-2 border-success/30 shadow-2xl text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
              </motion.div>

              {/* Reward Display */}
              {reward && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-4 mb-6"
                >
                  {reward.gold && (
                    <div className="game-card px-4 py-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      <span className="font-bold text-foreground">+{reward.gold} GOLD</span>
                    </div>
                  )}
                  {reward.xp && (
                    <div className="game-card px-4 py-3 flex items-center gap-2">
                      <span className="text-xp font-bold">+{reward.xp} XP</span>
                    </div>
                  )}
                </motion.div>
              )}

              <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 font-bold">
                {t.common.done}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
