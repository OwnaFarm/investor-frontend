"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createConfig, http } from "wagmi"
import { mantle } from "wagmi/chains"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [mantle],
  transports: {
    [mantle.id]: http(),
  },
})

interface PrivyWalletProviderProps {
  children: React.ReactNode
}

export function PrivyWalletProvider({ children }: PrivyWalletProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId || !mounted) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#22c55e",
        },
        loginMethods: ["wallet", "email"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
