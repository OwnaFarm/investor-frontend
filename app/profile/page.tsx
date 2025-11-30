"use client"

import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import { useAudio } from "@/contexts/audio-context"
import { GameHeader } from "@/components/layout/game-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { EditProfileModal } from "@/components/modals/edit-profile-modal"
import { LogoutModal } from "@/components/modals/logout-modal"
import { motion } from "framer-motion"
import {
  User,
  Settings,
  Globe,
  Bell,
  Moon,
  Volume2,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Wallet,
  TrendingUp,
  Sprout,
  Calendar,
  Trophy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { languageNames, languageFlags, type Language } from "@/lib/translations"
import { cn } from "@/lib/utils"

const achievements = [
  { id: 1, icon: "🌱", name: "First Seed", unlocked: true },
  { id: 2, icon: "🌾", name: "First Harvest", unlocked: true },
  { id: 3, icon: "💰", name: "1K Gold", unlocked: true },
  { id: 4, icon: "🏆", name: "Top 100", unlocked: false },
  { id: 5, icon: "👑", name: "Master Farmer", unlocked: false },
]

export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage()
  const { user, crops, updateUser } = useGame()
  const { isPlaying, toggleAudio } = useAudio()
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const languages: Language[] = ["en", "id", "zh"]

  // Calculate stats
  const totalInvested = crops.reduce((sum, c) => sum + c.invested, 0)
  const harvestedCount = 23 // This would come from game state in real app

  const stats = [
    { icon: Wallet, labelKey: "totalInvested", value: totalInvested.toLocaleString(), unit: "GOLD" },
    { icon: TrendingUp, labelKey: "totalEarnings", value: "1,250", unit: "GOLD" },
    { icon: Sprout, labelKey: "cropsHarvested", value: harvestedCount.toString(), unit: "" },
    { icon: Calendar, labelKey: "farmingDays", value: "45", unit: "" },
  ]

  const handleSaveProfile = (data: { name: string; avatar: string; wallet: string }) => {
    updateUser({
      name: data.name,
      avatar: data.avatar,
      wallet: data.wallet,
    })
  }

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("ownafarm_user")
    localStorage.removeItem("ownafarm_crops")
    localStorage.removeItem("ownafarm_language")
    // Reload page
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <GameHeader
        username={user.name}
        level={user.level}
        gold={user.gold}
        water={user.water}
        xp={user.xp}
        avatar={user.avatar}
      />

      <main className="px-4 py-4 max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-card p-6 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-4xl border-4 border-secondary shadow-xl">
              {user.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground text-sm font-black px-2.5 py-1 rounded-full shadow-lg">
              LVL {user.level}
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{user.wallet}</p>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>XP Progress</span>
              <span>
                {user.xp} / {user.level * 300}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp / (user.level * 300)) * 100}%` }}
                className="h-full bg-gradient-to-r from-xp to-xp/70 rounded-full"
              />
            </div>
          </div>

          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowEditProfile(true)}>
            <User className="w-4 h-4" />
            {t.profile.editProfile}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <section>
          <h3 className="font-bold text-foreground mb-3">{t.profile.myStats}</h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const label = t.profile[stat.labelKey as keyof typeof t.profile] || stat.labelKey
              return (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="game-card p-4 text-center"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-lg font-bold text-foreground">
                    {stat.value} <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            {t.profile.achievements}
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-1 border-2",
                  achievement.unlocked ? "bg-secondary/20 border-secondary/30" : "bg-muted border-muted opacity-50",
                )}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <span className="text-[10px] font-semibold text-center px-1 leading-tight">{achievement.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t.profile.settings}
          </h3>

          <div className="game-card divide-y divide-border">
            {/* Language */}
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{t.profile.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {languageFlags[language]} {languageNames[language]}
                </span>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    showLanguageSelector && "rotate-90",
                  )}
                />
              </div>
            </button>

            {/* Language Selector Dropdown */}
            {showLanguageSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-muted/30"
              >
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                      setShowLanguageSelector(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                      language === lang && "bg-primary/10",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{languageFlags[lang]}</span>
                      <span className="font-medium">{languageNames[lang]}</span>
                    </div>
                    {language === lang && <Check className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{t.profile.notifications}</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{t.profile.darkMode}</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{t.profile.sound}</span>
              </div>
              <Switch checked={isPlaying} onCheckedChange={toggleAudio} />
            </div>
          </div>
        </section>

        {/* More Options */}
        <div className="game-card divide-y divide-border">
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.profile.help}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.profile.terms}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.profile.privacy}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={() => setShowLogoutModal(true)}
          className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          {t.profile.logout}
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">{t.profile.version} 1.0.0</p>
      </main>

      <BottomNav />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
        currentData={{
          name: user.name,
          avatar: user.avatar,
          wallet: user.wallet,
        }}
      />

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>
  )
}
