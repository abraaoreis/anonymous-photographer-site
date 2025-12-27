import { Photo, PhotoFilters } from "../../models/photo"

export interface IPhotoRepository {
    findMany(filters?: PhotoFilters): Promise<Photo[]>
    create(photoData: Partial<Photo>): Promise<Photo>
}
