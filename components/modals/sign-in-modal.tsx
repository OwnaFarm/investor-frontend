"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: () => Promise<void>
  walletAddress: string
}

export function SignInModal({ isOpen, onClose, onSign, walletAddress }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSign = async () => {
    setIsLoading(true)
    try {
      await onSign()
    } finally {
      setIsLoading(false)
    }
  }

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
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-xl font-bold text-foreground text-center mb-2">Sign In to Continue</h2>
              <p className="text-muted-foreground text-center mb-4 text-sm">
                Please sign the message with your wallet to verify ownership and complete authentication.
              </p>

              <div className="bg-muted/50 rounded-lg p-3 mb-6">
                <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-foreground break-all">{walletAddress}</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 cursor-pointer"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSign}
                  className="flex-1 cursor-pointer gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Sign Message
                    </>
                  )}
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
