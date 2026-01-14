import { create } from 'zustand'
import type { LeaderboardStore, LeaderboardParams, LeaderboardResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API

const initialState = {
  entries: [],
  userEntry: null,
  currentType: 'xp' as const,
  isLoading: false,
  error: null,
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  ...initialState,

  getLeaderboard: async (token: string, params: LeaderboardParams): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('type', params.type)
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await fetch(`${API_BASE_URL}/leaderboard?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get leaderboard')
      }

      const data: LeaderboardResponse = await response.json()
      set({
        entries: data.entries,
        userEntry: data.user_entry,
        currentType: data.type,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get leaderboard'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
