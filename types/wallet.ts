export interface WalletState {
  address: string | null
  isConnected: boolean
  isLoading: boolean
  chainId: number | null
}

export interface WalletActions {
  setAddress: (address: string | null) => void
  setIsConnected: (isConnected: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setChainId: (chainId: number | null) => void
  reset: () => void
}

export type WalletStore = WalletState & WalletActions
