import { create } from 'zustand'
import type { Crop, CropListResponse, SyncCropsResponse, WaterCropResponse, CropListParams } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API

interface CropState {
  crops: Crop[]
  selectedCrop: Crop | null
  totalCount: number
  page: number
  limit: number
  isLoading: boolean
  error: string | null
}

interface CropActions {
  syncCrops: (token: string, txHash?: string) => Promise<SyncCropsResponse>
  getCrops: (token: string, params?: CropListParams) => Promise<void>
  getCropDetail: (token: string, cropId: string) => Promise<Crop>
  waterCrop: (token: string, cropId: string) => Promise<WaterCropResponse>
  syncHarvest: (token: string, cropId: string) => Promise<Crop>
  setSelectedCrop: (crop: Crop | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export type CropStore = CropState & CropActions

const initialState: CropState = {
  crops: [],
  selectedCrop: null,
  totalCount: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
}

export const useCropStore = create<CropStore>((set) => ({
  ...initialState,

  syncCrops: async (token: string, txHash?: string): Promise<SyncCropsResponse> => {
    set({ isLoading: true, error: null })
    try {
      const body = txHash ? JSON.stringify({ tx_hash: txHash }) : undefined

      const response = await fetch(`${API_BASE_URL}/crops/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      })

      if (!response.ok) {
        throw new Error('Failed to sync crops')
      }

      const data: SyncCropsResponse = await response.json()
      set({ isLoading: false })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync crops'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  getCrops: async (token: string, params?: CropListParams): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
      if (params?.sort_order) queryParams.append('sort_order', params.sort_order)

      const url = `${API_BASE_URL}/crops${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get crops')
      }

      const data: CropListResponse = await response.json()
      set({
        crops: data.crops,
        totalCount: data.total_count,
        page: data.page,
        limit: data.limit,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get crops'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  getCropDetail: async (token: string, cropId: string): Promise<Crop> => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get crop detail')
      }

      const data: Crop = await response.json()
      set({ selectedCrop: data, isLoading: false })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get crop detail'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  waterCrop: async (token: string, cropId: string): Promise<WaterCropResponse> => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}/water`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to water crop')
      }

      const data: WaterCropResponse = await response.json()
      
      set((state) => ({
        crops: state.crops.map((crop) =>
          crop.id === cropId ? data.crop : crop
        ),
        selectedCrop: state.selectedCrop?.id === cropId ? data.crop : state.selectedCrop,
        isLoading: false,
      }))

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to water crop'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  syncHarvest: async (token: string, cropId: string): Promise<Crop> => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}/harvest/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to sync harvest')
      }

      const data: Crop = await response.json()
      
      set((state) => ({
        crops: state.crops.map((crop) =>
          crop.id === cropId ? data : crop
        ),
        selectedCrop: state.selectedCrop?.id === cropId ? data : state.selectedCrop,
        isLoading: false,
      }))

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync harvest'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  setSelectedCrop: (crop: Crop | null) => set({ selectedCrop: crop }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
