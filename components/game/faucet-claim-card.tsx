"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Droplet, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFaucetStore } from "@/stores"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI } from "@/lib/contract"
import { formatEther } from "viem"
import { toast } from "sonner"

export function FaucetClaimCard() {
  const { address, isConnected } = useAccount()
  const { setLoading, setCanClaim, setTimeUntilNextClaim, setClaimAmount } = useFaucetStore()
  const { canClaim, timeUntilNextClaim, claimAmount, isLoading } = useFaucetStore()
  const [mounted, setMounted] = useState(false)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const { data: canClaimData } = useReadContract({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'canClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 30000,
    },
  })

  const { data: timeUntilNextClaimData } = useReadContract({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'timeUntilNextClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 30000,
    },
  })

  const { data: claimAmountData } = useReadContract({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'claimAmount',
    query: {
      enabled: isConnected,
      refetchInterval: 30000,
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (canClaimData !== undefined) {
      setCanClaim(canClaimData as boolean)
    }
  }, [canClaimData, setCanClaim])

  useEffect(() => {
    if (timeUntilNextClaimData !== undefined) {
      setTimeUntilNextClaim(Number(timeUntilNextClaimData))
    }
  }, [timeUntilNextClaimData, setTimeUntilNextClaim])

  useEffect(() => {
    if (claimAmountData !== undefined) {
      setClaimAmount(formatEther(claimAmountData as bigint))
    }
  }, [claimAmountData, setClaimAmount])

  useEffect(() => {
    setLoading(isPending || isConfirming)
  }, [isPending, isConfirming, setLoading])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Faucet tokens claimed successfully')
    }
  }, [isSuccess])

  const handleClaim = async () => {
    if (!address || !isConnected) {
      toast.error('Wallet not connected')
      return
    }

    try {
      writeContract({
        address: FAUCET_CONTRACT_ADDRESS,
        abi: FAUCET_ABI,
        functionName: 'claim',
      })
      toast.info('Transaction submitted. Waiting for confirmation...')
    } catch (error: any) {
      let errorMessage = 'Failed to claim faucet tokens'
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction rejected by user'
      } else if (error.message?.includes('CooldownActive')) {
        errorMessage = 'Cooldown period is still active. Please wait before claiming again.'
      } else if (error.message?.includes('FaucetEmpty')) {
        errorMessage = 'Faucet is currently empty. Please try again later.'
      }
      
      toast.error(errorMessage)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Ready"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  if (!mounted || !isConnected) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-card p-4"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Faucet Tokens</h3>
          <p className="text-sm text-muted-foreground">Claim free tokens every 24 hours</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Droplet className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Claim Amount</span>
          <span className="text-sm font-bold text-foreground">{claimAmount} GOLD</span>
        </div>

        {!canClaim && timeUntilNextClaim > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Next Claim
            </span>
            <span className="text-sm font-bold text-foreground">{formatTime(timeUntilNextClaim)}</span>
          </div>
        )}

        <Button
          onClick={handleClaim}
          disabled={!canClaim || isLoading}
          className="w-full h-12 text-base font-bold cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Claiming...'}
            </>
          ) : canClaim ? (
            <>
              <Droplet className="w-5 h-5 mr-2" />
              Claim Tokens
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 mr-2" />
              Cooldown Active
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
