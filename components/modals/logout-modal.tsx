"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const { t } = useLanguage()

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-card rounded-3xl p-6 max-w-sm w-full border-2 border-destructive/30 shadow-2xl">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>

              <h2 className="text-xl font-bold text-foreground text-center mb-2">{t.profile.logout}?</h2>
              <p className="text-muted-foreground text-center mb-6">
                Are you sure you want to logout from your account?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  {t.common.cancel}
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.profile.logout}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
