export interface MarketplaceInvoice {
  id: string
  name: string
  description: string
  image_url: string
  target_fund: string
  total_funded: string
  funding_progress: number
  yield_percent: string
  duration_days: number
  maturity_date: string
  farm_id: string
  farm_name: string
  farm_location: string
  farm_land_area: string
  farm_cctv_image: string
  farmer_name: string
  created_at: string
  approved_at: string
}

export interface MarketplacePagination {
  page: number
  limit: number
  total_items: number
  total_pages: number
}

export interface MarketplaceInvoicesResponse {
  status: string
  data: {
    invoices: MarketplaceInvoice[]
    pagination: MarketplacePagination
  }
}

export interface MarketplaceInvoicesParams {
  min_price?: number
  max_price?: number
  min_yield?: number
  max_yield?: number
  min_duration?: number
  max_duration?: number
  min_land_area?: number
  max_land_area?: number
  location?: string
  crop_type?: string
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'name' | 'target_fund' | 'yield_percent' | 'duration_days'
  sort_order?: 'asc' | 'desc'
}

export interface MarketplaceState {
  invoices: MarketplaceInvoice[]
  pagination: MarketplacePagination | null
  isLoading: boolean
  error: string | null
}

export interface MarketplaceActions {
  getInvoices: (token: string, params?: MarketplaceInvoicesParams) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export type MarketplaceStore = MarketplaceState & MarketplaceActions
