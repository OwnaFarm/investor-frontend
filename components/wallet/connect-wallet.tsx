"use client"

import { useEffect, useState } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useWalletStore, useAuthStore } from "@/stores"
import { SignInModal } from "@/components/modals/sign-in-modal"
import { ConnectWalletModal } from "@/components/modals/connect-wallet-modal"

const OWNAFARM_CHAIN_ID = 5003
const DOMAIN_NAME = "OwnaFarm"
const DOMAIN_VERSION = "1"
const PRIMARY_TYPE = "Login"

type NonceResponse = {
  data: {
    nonce: string
    message: string
  }
}

function normalizeAddress(addr: string) {
  return (addr || "").trim().toLowerCase()
}

function buildTypedData(messageFromBackend: string, chainId: number) {
  const domain = {
    name: DOMAIN_NAME,
    version: DOMAIN_VERSION,
    chainId,
  }

  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    Login: [{ name: "message", type: "string" }],
  }

  const message = {
    message: messageFromBackend,
  }

  return {
    domain,
    types,
    primaryType: PRIMARY_TYPE,
    message,
  }
}

async function signTypedDataV4(provider: any, address: string, typedData: any) {
  const payload = JSON.stringify(typedData)
  const params = [address, payload]

  try {
    const sig = (await provider.request({
      method: "eth_signTypedData_v4",
      params,
    })) as string
    if (typeof sig === "string" && sig.startsWith("0x")) return sig
    throw new Error("Invalid signature response")
  } catch (e1) {
    try {
      const sig = (await provider.request({
        method: "eth_signTypedData",
        params,
      })) as string
      if (typeof sig === "string" && sig.startsWith("0x")) return sig
      throw new Error("Invalid signature response")
    } catch (e2) {
      throw e1 instanceof Error ? e1 : new Error("Failed to sign typed data")
    }
  }
}

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
    reset: resetWallet,
  } = useWalletStore()
  const { token, getNonce, login: authLogin, logout: authLogout, initializeAuth } =
    useAuthStore()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [pendingAuth, setPendingAuth] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!ready) {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (authenticated && wallets.length > 0) {
      const wallet = wallets[0]
      const nextAddress = normalizeAddress(wallet.address)

      setAddress(nextAddress)
      setIsConnected(true)

      const nextChainId =
        wallet.chainId !== undefined && wallet.chainId !== null
          ? Number(wallet.chainId)
          : null
      setChainId(Number.isFinite(nextChainId as number) ? (nextChainId as number) : null)

      if (!token && !pendingAuth) {
        setPendingAuth(true)
        setShowSignInModal(true)
      }
    } else {
      resetWallet()
    }
  }, [
    authenticated,
    wallets,
    ready,
    setAddress,
    setIsConnected,
    setIsLoading,
    setChainId,
    resetWallet,
    token,
    pendingAuth,
  ])

  const handleSign = async () => {
    if (!wallets.length) {
      toast.error("Wallet not connected")
      return
    }

    const wallet = wallets[0]
    const walletAddress = normalizeAddress(wallet.address)

    if (!walletAddress) {
      toast.error("Wallet not connected")
      return
    }

    const connectedChainId =
      wallet.chainId !== undefined && wallet.chainId !== null
        ? Number(wallet.chainId)
        : null

    if (connectedChainId && connectedChainId !== OWNAFARM_CHAIN_ID) {
      toast.error(`Wrong network. Please switch to chain ${OWNAFARM_CHAIN_ID}.`)
      return
    }

    try {
      setIsLoading(true)

      const nonceResponse = (await getNonce(walletAddress)) as NonceResponse
      const nonce = nonceResponse?.data?.nonce
      const messageFromBackend = nonceResponse?.data?.message

      if (!nonce || !messageFromBackend) {
        throw new Error("Invalid nonce response from backend")
      }

      const typedData = buildTypedData(messageFromBackend, OWNAFARM_CHAIN_ID)

      const provider = await wallet.getEthereumProvider()
      if (!provider?.request) {
        throw new Error("Wallet provider not available")
      }

      const signature = await signTypedDataV4(provider, walletAddress, typedData)

      await authLogin(walletAddress, signature, nonce)

      setShowSignInModal(false)
      setPendingAuth(false)
      toast.success("Successfully signed in")
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to sign in"
      toast.error(errorMsg)
      setPendingAuth(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    try {
      setIsLoading(true)
      login()
      setShowConnectModal(false)
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
      authLogout()
      resetWallet()
      setPendingAuth(false)
      setShowSignInModal(false)
      toast.success("Wallet disconnected")
    } catch (error) {
      toast.error("Failed to disconnect wallet")
    } finally {
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
      <>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="cursor-pointer"
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSign={handleSign}
          walletAddress={address}
        />
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setShowConnectModal(true)} className="cursor-pointer">
        Connect Wallet
      </Button>
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnect}
      />
    </>
  )
}
