import { create } from 'zustand'
import type { Crop, CropListResponse, SyncCropsResponse, WaterCropResponse, CropListParams } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API

const MOCK_CROPS: Crop[] = [
  {
    id: 'mock-1',
    name: 'Tomato',
    image: '/tomato-plant-cartoon-cute.jpg',
    cctv_image: '/cctv-sayur-selada.png',
    location: 'West Java Farm, Block A',
    progress: 75,
    days_left: 5,
    yield_percent: 12,
    invested: 100,
    status: 'growing',
    planted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    water_count: 8,
    can_harvest: false,
  },
  {
    id: 'mock-2',
    name: 'Corn',
    image: '/corn-plant-cartoon-cute.jpg',
    cctv_image: '/cctv-sayur-selada.png',
    location: 'West Java Farm, Block B',
    progress: 100,
    days_left: 0,
    yield_percent: 15,
    invested: 150,
    status: 'ready',
    planted_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    water_count: 14,
    can_harvest: true,
    harvest_amount: 172,
  },
  {
    id: 'mock-3',
    name: 'Coffee',
    image: '/coffee-plant-cartoon.jpg',
    cctv_image: '/cctv-sayur-selada.png',
    location: 'Central Java Farm, Block C',
    progress: 45,
    days_left: 12,
    yield_percent: 18,
    invested: 200,
    status: 'growing',
    planted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    water_count: 5,
    can_harvest: false,
  },
  {
    id: 'mock-4',
    name: 'Onion',
    image: '/onion-plant-cartoon.jpg',
    cctv_image: '/cctv-sayur-selada.png',
    location: 'East Java Farm, Block D',
    progress: 100,
    days_left: 0,
    yield_percent: 10,
    invested: 80,
    status: 'ready',
    planted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    water_count: 10,
    can_harvest: true,
    harvest_amount: 88,
  },
  {
    id: 'mock-5',
    name: 'Red Chili',
    image: '/red-chili-pepper-plant-cartoon.jpg',
    cctv_image: '/cctv-sayur-selada.png',
    location: 'West Java Farm, Block E',
    progress: 30,
    days_left: 18,
    yield_percent: 20,
    invested: 120,
    status: 'growing',
    planted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    water_count: 3,
    can_harvest: false,
  },
]

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
  waterAllCrops: (token: string) => Promise<{ watered_count: number; xp_gained: number; water_remaining: number }>
  syncHarvest: (token: string, cropId: string) => Promise<Crop>
  addMockCrop: (seed: { name: string; image: string; cctvImage?: string; location?: string; price: number; yieldPercent: number; duration: number }) => void
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
    
    if (!token || !API_BASE_URL) {
      set({
        crops: MOCK_CROPS,
        totalCount: MOCK_CROPS.length,
        page: 1,
        limit: 10,
        isLoading: false,
        error: null,
      })
      return
    }

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
      
      if (!data.crops || data.crops.length === 0) {
        set({
          crops: MOCK_CROPS,
          totalCount: MOCK_CROPS.length,
          page: 1,
          limit: 10,
          isLoading: false,
          error: null,
        })
        return
      }

      set({
        crops: data.crops,
        totalCount: data.total_count,
        page: data.page,
        limit: data.limit,
        isLoading: false,
      })
    } catch (error) {
      set({
        crops: MOCK_CROPS,
        totalCount: MOCK_CROPS.length,
        page: 1,
        limit: 10,
        isLoading: false,
        error: null,
      })
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
      const mockCrop = MOCK_CROPS.find((c) => c.id === cropId)
      if (mockCrop) {
        set({ selectedCrop: mockCrop, isLoading: false })
        return mockCrop
      }
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
      const mockCrop = MOCK_CROPS.find((c) => c.id === cropId)
      if (mockCrop) {
        const updatedCrop: Crop = {
          ...mockCrop,
          water_count: mockCrop.water_count + 1,
          progress: Math.min(mockCrop.progress + 5, 100),
        }
        const mockResponse: WaterCropResponse = {
          crop: updatedCrop,
          xp_gained: 10,
          water_remaining: 5,
        }
        set((state) => ({
          crops: state.crops.map((crop) =>
            crop.id === cropId ? updatedCrop : crop
          ),
          selectedCrop: state.selectedCrop?.id === cropId ? updatedCrop : state.selectedCrop,
          isLoading: false,
        }))
        return mockResponse
      }
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
      const state = useCropStore.getState()
      const mockCrop = state.crops.find((c) => c.id === cropId)
      if (mockCrop) {
        const harvestedCrop: Crop = {
          ...mockCrop,
          status: 'harvested',
          harvest_amount: Math.round(mockCrop.invested * (1 + mockCrop.yield_percent / 100)),
        }
        set((state) => ({
          crops: state.crops.filter((crop) => crop.id !== cropId),
          selectedCrop: null,
          isLoading: false,
        }))
        return harvestedCrop
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync harvest'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  waterAllCrops: async (token: string): Promise<{ watered_count: number; xp_gained: number; water_remaining: number }> => {
    set({ isLoading: true, error: null })
    
    const state = useCropStore.getState()
    const growingCrops = state.crops.filter((c) => c.status === 'growing')
    
    if (growingCrops.length === 0) {
      set({ isLoading: false })
      return { watered_count: 0, xp_gained: 0, water_remaining: 10 }
    }

    try {
      if (!token || !API_BASE_URL) {
        throw new Error('Using mock data')
      }

      const response = await fetch(`${API_BASE_URL}/crops/water-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to water all crops')
      }

      const data = await response.json()
      await useCropStore.getState().getCrops(token)
      set({ isLoading: false })
      return data
    } catch (error) {
      const currentGrowingCrops = useCropStore.getState().crops.filter((c) => c.status === 'growing')
      
      set((state) => ({
        crops: state.crops.map((crop) => {
          if (crop.status === 'growing') {
            const newProgress = Math.min(crop.progress + 5, 100)
            const newStatus: 'growing' | 'ready' | 'harvested' = newProgress >= 100 ? 'ready' : 'growing'
            return {
              ...crop,
              progress: newProgress,
              water_count: crop.water_count + 1,
              status: newStatus,
              days_left: newProgress >= 100 ? 0 : Math.max(0, crop.days_left - 1),
            }
          }
          return crop
        }),
        isLoading: false,
      }))
      
      return {
        watered_count: currentGrowingCrops.length,
        xp_gained: currentGrowingCrops.length * 10,
        water_remaining: 10 - currentGrowingCrops.length,
      }
    }
  },

  addMockCrop: (seed: { name: string; image: string; cctvImage?: string; location?: string; price: number; yieldPercent: number; duration: number }) => {
    const newCrop: Crop = {
      id: `mock-${Date.now()}`,
      name: seed.name,
      image: seed.image,
      cctv_image: seed.cctvImage || '/cctv-sayur-selada.png',
      location: seed.location || 'West Java Farm',
      progress: 0,
      days_left: seed.duration,
      yield_percent: seed.yieldPercent,
      invested: seed.price,
      status: 'growing',
      planted_at: new Date().toISOString(),
      water_count: 0,
      can_harvest: false,
    }
    
    set((state) => ({
      crops: [...state.crops, newCrop],
      totalCount: state.totalCount + 1,
    }))
  },

  setSelectedCrop: (crop: Crop | null) => set({ selectedCrop: crop }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
