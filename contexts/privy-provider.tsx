"use client"

import { useEffect, useState, useMemo } from "react"
import type React from "react"
import type { PrivyClientConfig } from "@privy-io/react-auth"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createConfig, http } from "wagmi"
import { mantle } from "wagmi/chains"

interface PrivyWalletProviderProps {
  children: React.ReactNode
}

export function PrivyWalletProvider({ children }: PrivyWalletProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
    []
  )

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        chains: [mantle],
        transports: {
          [mantle.id]: http(),
        },
      }),
    []
  )

  const privyConfig = useMemo<PrivyClientConfig>(
    () => ({
      appearance: {
        theme: "dark",
        accentColor: "#22c55e",
        showWalletLoginFirst: true,
      },
      loginMethods: ["wallet", "email"],
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
      supportedChains: [mantle],
      defaultChain: mantle,
    }),
    []
  )

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId || !mounted) {
    return <>{children}</>
  }

  return (
    <PrivyProvider appId={appId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
