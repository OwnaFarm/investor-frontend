export interface Crop {
  id: string
  name: string
  image: string
  cctv_image: string
  location: string
  progress: number
  days_left: number
  yield_percent: number
  invested: number
  status: 'growing' | 'ready' | 'harvested'
  planted_at: string
  water_count: number
  can_harvest: boolean
  harvest_amount?: number
}

export interface CropListResponse {
  crops: Crop[]
  total_count: number
  page: number
  limit: number
}

export interface SyncCropsResponse {
  synced_count: number
  new_crops: Crop[]
}

export interface WaterCropResponse {
  crop: Crop
  xp_gained: number
  water_remaining: number
}

export interface CropListParams {
  status?: 'growing' | 'ready' | 'harvested'
  page?: number
  limit?: number
  sort_by?: 'invested_at' | 'progress' | 'status'
  sort_order?: 'asc' | 'desc'
}
