"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Trophy, User, Sprout } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", icon: Home, labelKey: "home" as const },
  { href: "/shop", icon: ShoppingBag, labelKey: "shop" as const },
  { href: "/farm", icon: Sprout, labelKey: "farm" as const, isMain: true },
  { href: "/leaderboard", icon: Trophy, labelKey: "leaderboard" as const },
  { href: "/profile", icon: User, labelKey: "profile" as const },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t-2 border-border safe-area-inset-bottom">
      <div className="flex items-end justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const label = t.nav[item.labelKey]

          if (item.isMain) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "nav-main-btn flex items-center justify-center w-16 h-16 rounded-full shadow-xl",
                    isActive ? "animate-pulse-glow" : "",
                  )}
                  style={{
                    background: isActive
                      ? "linear-gradient(145deg, oklch(0.55 0.2 140), oklch(0.45 0.2 140))"
                      : "linear-gradient(145deg, oklch(0.5 0.18 140), oklch(0.4 0.18 140))",
                  }}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <span className={cn("text-xs mt-1 font-bold", isActive ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </Link>
            )
          }

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center py-2 px-3 min-w-[60px]">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive ? "bg-primary/10" : "bg-transparent",
                )}
              >
                <Icon
                  className={cn("w-6 h-6 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={cn(
                  "text-xs mt-0.5 font-semibold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
