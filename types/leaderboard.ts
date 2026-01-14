export type LeaderboardType = 'xp' | 'wealth' | 'profit'

export interface LeaderboardEntry {
  rank: number
  wallet_address: string
  score: number
  is_current_user: boolean
}

export interface LeaderboardResponse {
  type: LeaderboardType
  entries: LeaderboardEntry[]
  user_entry: LeaderboardEntry | null
}

export interface LeaderboardParams {
  type: LeaderboardType
  limit?: number
}

export interface LeaderboardState {
  entries: LeaderboardEntry[]
  userEntry: LeaderboardEntry | null
  currentType: LeaderboardType
  isLoading: boolean
  error: string | null
}

export interface LeaderboardActions {
  getLeaderboard: (token: string, params: LeaderboardParams) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export type LeaderboardStore = LeaderboardState & LeaderboardActions
