import { Photo, PhotoFilters } from "../../models/photo"

export interface IPhotoRepository {
    findMany(filters?: PhotoFilters): Promise<Photo[]>
    findById(id: string): Promise<Photo | null>
    create(photoData: Partial<Photo>): Promise<Photo>
    incrementViews(id: string): Promise<void>
    incrementDownloads(id: string): Promise<void>
}
