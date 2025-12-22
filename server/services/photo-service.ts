import { PhotoRepository } from "../repositories/photo-repository"
import { PhotoFilters } from "../models/photo"

export class PhotoService {
    private static photoRepository = new PhotoRepository()

    static async getPhotos(filters: PhotoFilters = {}) {
        return this.photoRepository.findMany(filters)
    }
}
