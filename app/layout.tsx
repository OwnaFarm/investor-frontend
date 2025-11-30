import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { GameProvider } from "@/contexts/game-context"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "OwnaFarm - Gamified RWA Farming",
  description: "Grow your wealth with contract farming. A gamified investment platform.",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: "/ownaFarm_11zon.png",
    apple: "/ownaFarm_11zon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <GameProvider>{children}</GameProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
