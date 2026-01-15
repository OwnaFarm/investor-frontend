import { create } from 'zustand'
import type { MarketplaceStore, MarketplaceInvoice, MarketplaceInvoicesResponse, MarketplaceInvoicesParams } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API

const MOCK_INVOICES: MarketplaceInvoice[] = [
  {
    id: 'mock-inv-1',
    name: 'Tomato Seeds',
    description: 'Premium tomato seeds from West Java highlands. High yield variety with excellent taste.',
    image_url: '/tomato-seed-packet-cartoon-cute.jpg',
    target_fund: '100',
    total_funded: '75',
    funding_progress: 75,
    yield_percent: '12',
    duration_days: 14,
    maturity_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-1',
    farm_name: 'West Java Farm',
    farm_location: 'West Java, Indonesia',
    farm_land_area: '2.5',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Budi',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'mock-inv-2',
    name: 'Corn Seeds',
    description: 'Sweet corn variety perfect for tropical climate. Fast growing and high demand.',
    image_url: '/corn-seed-packet-cartoon-cute.jpg',
    target_fund: '150',
    total_funded: '120',
    funding_progress: 80,
    yield_percent: '15',
    duration_days: 21,
    maturity_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-2',
    farm_name: 'Central Java Farm',
    farm_location: 'Central Java, Indonesia',
    farm_land_area: '3.0',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Agus',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'mock-inv-3',
    name: 'Coffee Beans',
    description: 'Arabica coffee beans from highland farms. Premium quality with rich aroma.',
    image_url: '/coffee-bean-seed-packet-cartoon.jpg',
    target_fund: '200',
    total_funded: '50',
    funding_progress: 25,
    yield_percent: '18',
    duration_days: 30,
    maturity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-3',
    farm_name: 'Highland Coffee Farm',
    farm_location: 'East Java, Indonesia',
    farm_land_area: '5.0',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Joko',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'mock-inv-4',
    name: 'Onion Seeds',
    description: 'Red onion seeds with high market demand. Short growing cycle with stable returns.',
    image_url: '/onion-seed-packet-cartoon.jpg',
    target_fund: '80',
    total_funded: '80',
    funding_progress: 100,
    yield_percent: '10',
    duration_days: 10,
    maturity_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-4',
    farm_name: 'Brebes Farm',
    farm_location: 'Brebes, Central Java',
    farm_land_area: '1.5',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Hasan',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'mock-inv-5',
    name: 'Red Chili Seeds',
    description: 'Spicy red chili variety. High demand in local markets with premium pricing.',
    image_url: '/red-chili-seed-packet-cartoon.jpg',
    target_fund: '120',
    total_funded: '30',
    funding_progress: 25,
    yield_percent: '20',
    duration_days: 25,
    maturity_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-5',
    farm_name: 'Chili Paradise Farm',
    farm_location: 'West Java, Indonesia',
    farm_land_area: '2.0',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Dedi',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'mock-inv-6',
    name: 'Potato Seeds',
    description: 'Premium potato variety from highland farms. Consistent quality and high yield.',
    image_url: '/potato-seed-packet-cartoon.jpg',
    target_fund: '180',
    total_funded: '90',
    funding_progress: 50,
    yield_percent: '14',
    duration_days: 28,
    maturity_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    farm_id: 'farm-6',
    farm_name: 'Dieng Plateau Farm',
    farm_location: 'Dieng, Central Java',
    farm_land_area: '4.0',
    farm_cctv_image: '/cctv-sayur-selada.png',
    farmer_name: 'Pak Surya',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
]

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

    if (!token || !API_BASE_URL) {
      set({
        invoices: MOCK_INVOICES,
        pagination: {
          page: 1,
          limit: 20,
          total_items: MOCK_INVOICES.length,
          total_pages: 1,
        },
        isLoading: false,
        error: null,
      })
      return
    }

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
      
      if (!data.data.invoices || data.data.invoices.length === 0) {
        set({
          invoices: MOCK_INVOICES,
          pagination: {
            page: 1,
            limit: 20,
            total_items: MOCK_INVOICES.length,
            total_pages: 1,
          },
          isLoading: false,
          error: null,
        })
        return
      }
      
      set({
        invoices: data.data.invoices,
        pagination: data.data.pagination,
        isLoading: false,
      })
    } catch (error) {
      set({
        invoices: MOCK_INVOICES,
        pagination: {
          page: 1,
          limit: 20,
          total_items: MOCK_INVOICES.length,
          total_pages: 1,
        },
        isLoading: false,
        error: null,
      })
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
