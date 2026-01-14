"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: () => void
}

export function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] px-4 pointer-events-none"
          >
            <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border shadow-2xl pointer-events-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-xl font-bold text-foreground text-center mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground text-center mb-6 text-sm">
                Connect your wallet to access all features and start your farming journey.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure Authentication</p>
                    <p className="text-xs text-muted-foreground">Your wallet credentials are never stored</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Quick Setup</p>
                    <p className="text-xs text-muted-foreground">Connect in seconds and start playing</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConnect}
                  className="flex-1 cursor-pointer gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
