import { create } from 'zustand'
import type { MarketplaceStore, MarketplaceInvoicesResponse, MarketplaceInvoicesParams } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API

const initialState = {
  invoices: [],
  pagination: null,
  isLoading: false,
  error: null,
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  ...initialState,

  getInvoices: async (token: string, params?: MarketplaceInvoicesParams): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.min_price !== undefined) queryParams.append('min_price', params.min_price.toString())
      if (params?.max_price !== undefined) queryParams.append('max_price', params.max_price.toString())
      if (params?.min_yield !== undefined) queryParams.append('min_yield', params.min_yield.toString())
      if (params?.max_yield !== undefined) queryParams.append('max_yield', params.max_yield.toString())
      if (params?.min_duration !== undefined) queryParams.append('min_duration', params.min_duration.toString())
      if (params?.max_duration !== undefined) queryParams.append('max_duration', params.max_duration.toString())
      if (params?.min_land_area !== undefined) queryParams.append('min_land_area', params.min_land_area.toString())
      if (params?.max_land_area !== undefined) queryParams.append('max_land_area', params.max_land_area.toString())
      if (params?.location) queryParams.append('location', params.location)
      if (params?.crop_type) queryParams.append('crop_type', params.crop_type)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
      if (params?.sort_order) queryParams.append('sort_order', params.sort_order)

      const url = `${API_BASE_URL}/marketplace/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get marketplace invoices')
      }

      const data: MarketplaceInvoicesResponse = await response.json()
      
      console.log("=== MARKETPLACE API RESPONSE ===")
      console.log("Raw response:", data)
      console.log("Invoices:", data.data.invoices)
      console.log("Pagination:", data.data.pagination)
      
      set({
        invoices: data.data.invoices,
        pagination: data.data.pagination,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get marketplace invoices'
      set({ isLoading: false, error: errorMessage })
      throw error
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
