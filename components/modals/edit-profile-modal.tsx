"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

const avatarOptions = [
  { id: "1", emoji: "👨‍🌾", name: "Farmer" },
  { id: "2", emoji: "👩‍🌾", name: "Farmgirl" },
  { id: "3", emoji: "🧑‍🌾", name: "Agriculturist" },
  { id: "4", emoji: "🤠", name: "Cowboy" },
  { id: "5", emoji: "👷", name: "Worker" },
  { id: "6", emoji: "🧑‍🔬", name: "Scientist" },
  { id: "7", emoji: "🦊", name: "Fox" },
  { id: "8", emoji: "🐸", name: "Frog" },
  { id: "9", emoji: "🐱", name: "Cat" },
  { id: "10", emoji: "🐶", name: "Dog" },
  { id: "11", emoji: "🦁", name: "Lion" },
  { id: "12", emoji: "🐼", name: "Panda" },
]

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; avatar: string; wallet: string }) => void
  currentData: {
    name: string
    avatar: string
    wallet: string
  }
}

export function EditProfileModal({ isOpen, onClose, onSave, currentData }: EditProfileModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState(currentData.name)
  const [avatar, setAvatar] = useState(currentData.avatar)
  const [wallet, setWallet] = useState(currentData.wallet)

  const handleSave = () => {
    onSave({ name, avatar, wallet })
    onClose()
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

              <h2 className="text-xl font-bold text-foreground mb-6">{t.profile.editProfile}</h2>

              {/* Current Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-5xl border-4 border-secondary shadow-xl">
                    {avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">Choose Avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarOptions.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAvatar(opt.emoji)}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all border-2",
                        avatar === opt.emoji
                          ? "bg-primary/20 border-primary"
                          : "bg-muted border-transparent hover:border-muted-foreground/30",
                      )}
                    >
                      {opt.emoji}
                      {avatar === opt.emoji && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Username</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-muted border-muted"
                />
              </div>

              {/* Wallet Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.profile.walletAddress}
                </label>
                <Input
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..."
                  className="bg-muted border-muted font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  {t.common.cancel}
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 font-bold">
                  {t.common.save}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
