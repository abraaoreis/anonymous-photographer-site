import { Photo, PhotoFilters, UploadResult } from "@/server/models/photo"

export class PhotoApi {
    static async getPhotos(filters: PhotoFilters = {}): Promise<Photo[]> {
        const searchParams = new URLSearchParams()
        if (filters.search) searchParams.append("search", filters.search)
        if (filters.tag && filters.tag !== "all") searchParams.append("tag", filters.tag)

        const response = await fetch(`/api/photos?${searchParams.toString()}`)
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Erro ao carregar fotos")
        }

        const data = await response.json()
        return data.photos as Photo[]
    }

    static async uploadPhoto(formData: FormData): Promise<UploadResult> {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Erro ao subir imagem")
        }

        return response.json()
    }
}
