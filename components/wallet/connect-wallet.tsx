"use client"

import { useEffect, useState } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/stores"

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button disabled variant="outline">
        Connect Wallet
      </Button>
    )
  }

  return <ConnectWalletClient />
}

function ConnectWalletClient() {
  const { login, logout, authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const {
    address,
    isConnected,
    setAddress,
    setIsConnected,
    setIsLoading,
    setChainId,
    reset,
  } = useWalletStore()

  useEffect(() => {
    if (!ready) {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (authenticated && wallets.length > 0) {
      const wallet = wallets[0]
      setAddress(wallet.address)
      setIsConnected(true)
      setChainId(wallet.chainId ? Number(wallet.chainId) : null)
    } else {
      reset()
    }
  }, [authenticated, wallets, ready, setAddress, setIsConnected, setIsLoading, setChainId, reset])

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      await login()
      toast.info("Please complete the wallet connection")
    } catch (error) {
      toast.error("Failed to connect wallet")
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await logout()
      reset()
      toast.success("Wallet disconnected")
    } catch (error) {
      toast.error("Failed to disconnect wallet")
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <Button disabled variant="outline">
        Loading...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <Button
        onClick={handleDisconnect}
        variant="outline"
        className="cursor-pointer"
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} className="cursor-pointer">
      Connect Wallet
    </Button>
  )
}
