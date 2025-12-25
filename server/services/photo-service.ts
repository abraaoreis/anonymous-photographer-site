import { PhotoRepositoryFactory } from "../repositories/photo-repository-factory"
import { PhotoFilters } from "../models/photo"

export class PhotoService {
    private static photoRepository = PhotoRepositoryFactory.getPhotoRepository()

    static async getPhotos(filters: PhotoFilters = {}) {
        return this.photoRepository.findMany(filters)
    }
}
