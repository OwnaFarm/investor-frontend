import { create } from 'zustand'

interface FaucetState {
  isLoading: boolean
  error: string | null
  canClaim: boolean
  timeUntilNextClaim: number
  claimAmount: string
  totalClaimed: string
}

interface FaucetActions {
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setCanClaim: (canClaim: boolean) => void
  setTimeUntilNextClaim: (time: number) => void
  setClaimAmount: (amount: string) => void
  setTotalClaimed: (total: string) => void
}

export type FaucetStore = FaucetState & FaucetActions

const initialState: FaucetState = {
  isLoading: false,
  error: null,
  canClaim: false,
  timeUntilNextClaim: 0,
  claimAmount: '0',
  totalClaimed: '0',
}

export const useFaucetStore = create<FaucetStore>((set) => ({
  ...initialState,

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setCanClaim: (canClaim: boolean) => set({ canClaim }),
  setTimeUntilNextClaim: (time: number) => set({ timeUntilNextClaim: time }),
  setClaimAmount: (amount: string) => set({ claimAmount: amount }),
  setTotalClaimed: (total: string) => set({ totalClaimed: total }),
}))
