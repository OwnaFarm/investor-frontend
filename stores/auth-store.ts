import { create } from 'zustand'
import type { AuthStore, NonceResponse, LoginResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API
const AUTH_TOKEN_KEY = 'auth_token'

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

const initialState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  initializeAuth: () => {
    const storedToken = getStoredToken()
    if (storedToken) {
      set({ token: storedToken })
    }
  },

  getNonce: async (walletAddress: string): Promise<NonceResponse> => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/auth/nonce?wallet_address=${walletAddress}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to get nonce')
      }

      const data = await response.json()
      console.log("Nonce API response:", data)
      
      set({ isLoading: false })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get nonce'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  login: async (walletAddress: string, signature: string, nonce: string): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const requestBody = {
        wallet_address: walletAddress,
        signature: signature,
        nonce: nonce,
      }
      
      console.log("=== LOGIN REQUEST ===")
      console.log("Request body:", JSON.stringify(requestBody, null, 2))
      console.log("Wallet address:", walletAddress)
      console.log("Signature:", signature)
      console.log("Nonce:", nonce)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseData = await response.json()
      console.log("Login response status:", response.status)
      console.log("Login response:", JSON.stringify(responseData, null, 2))

      if (!response.ok || responseData.status === 'error') {
        throw new Error(responseData.message || 'Authentication failed')
      }

      const data: LoginResponse = responseData
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.data.token)
      }
      
      set({
        token: data.data.token,
        user: data.data.user,
        isLoading: false,
        error: null,
      })
      
      console.log("=== LOGIN SUCCESS ===")
    } catch (error) {
      console.error("=== LOGIN ERROR ===")
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
    }
    set(initialState)
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
