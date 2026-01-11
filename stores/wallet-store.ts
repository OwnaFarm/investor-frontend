import { create } from 'zustand'
import type { WalletStore } from '@/types'

const initialState = {
  address: null,
  isConnected: false,
  isLoading: false,
  chainId: null,
}

export const useWalletStore = create<WalletStore>((set) => ({
  ...initialState,
  setAddress: (address) => set({ address }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setChainId: (chainId) => set({ chainId }),
  reset: () => set(initialState),
}))
