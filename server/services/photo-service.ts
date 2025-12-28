import { PhotoRepositoryFactory } from "../repositories/photo-repository-factory"
import { PhotoFilters } from "../models/photo"

export class PhotoService {
    private static photoRepository = PhotoRepositoryFactory.getPhotoRepository()

    static async getPhotos(filters: PhotoFilters = {}) {
        return this.photoRepository.findMany(filters)
    }

    static async getPhotoById(id: string) {
        return this.photoRepository.findById(id)
    }

    static async recordView(id: string) {
        return this.photoRepository.incrementViews(id)
    }

    static async recordDownload(id: string) {
        return this.photoRepository.incrementDownloads(id)
    }
}
