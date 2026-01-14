export interface NonceResponse {
  status: string
  data: {
    nonce: string
    message: string
  }
}

export interface LoginResponse {
  status: string
  data: {
    token: string
    user: {
      id: string
      wallet_address: string
    }
  }
}

export interface AuthState {
  token: string | null
  user: {
    id: string
    wallet_address: string
  } | null
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  getNonce: (walletAddress: string) => Promise<NonceResponse>
  login: (walletAddress: string, signature: string, nonce: string) => Promise<void>
  logout: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export type AuthStore = AuthState & AuthActions
