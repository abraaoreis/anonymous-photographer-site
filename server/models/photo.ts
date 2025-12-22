export interface Photo {
    id: string
    url: string
    filename: string
    name: string
    category: string
    size: number
    width: number
    height: number
    megapixels: string
    created_at: string
    tags: string[]
    camera?: string
    aperture?: string
    lens_type?: string
    location?: string
    description?: string
}

export interface PhotoFilters {
    search?: string
    tag?: string
}

export interface UploadResult {
    success: boolean
    url: string
    filename: string
    width: number
    height: number
    megapixels: string
}
