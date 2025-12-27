import { UploadResult } from "../models/photo"
import { PhotoRepositoryFactory } from "../repositories/photo-repository-factory"
import { RepositoryFactory } from "../repositories/repository-factory"

export class UploadService {
    private static photoRepository = PhotoRepositoryFactory.getPhotoRepository()
    private static storageRepository = RepositoryFactory.getStorageRepository()

    static async uploadPhoto(formData: FormData): Promise<UploadResult> {
        const file = formData.get("file") as File
        const name = formData.get("name") as string
        const category = formData.get("category") as string
        const camera = formData.get("camera") as string
        const aperture = formData.get("aperture") as string
        const lensType = formData.get("lensType") as string
        const location = formData.get("location") as string
        const description = formData.get("description") as string
        const tagsString = formData.get("tags") as string
        const width = parseInt(formData.get("width") as string || "0")
        const height = parseInt(formData.get("height") as string || "0")
        const hash = formData.get("hash") as string

        if (!file) throw new Error("No se proporcionó ningún archivo")
        if (!name || !category) throw new Error("El nombre y la categoría son obligatorios")
        if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen")

        const MAX_SIZE = 10 * 1024 * 1024
        if (file.size > MAX_SIZE) throw new Error("La imagen no puede superar los 10MB")

        const megapixels = (width * height) / 1000000

        if (width === 0 || height === 0) throw new Error("Las dimensiones de la imagen no son válidas")
        if (megapixels < 1) throw new Error("La resolución mínima es de 1 megapíxel")

        const blobUrl = await this.storageRepository.upload(file.name, file)

        const tags = tagsString
            ? tagsString.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
            : []

        const createdPhoto = await this.photoRepository.create({
            url: blobUrl,
            filename: file.name,
            name,
            category,
            camera: camera || undefined,
            aperture: aperture || undefined,
            lens_type: lensType || undefined,
            location: location || undefined,
            description: description || undefined,
            tags,
            size: file.size,
            width,
            height,
            megapixels: megapixels.toFixed(2),
            content_hash: hash || undefined,
        })

        return {
            success: true,
            url: blobUrl,
            filename: file.name,
            width,
            height,
            megapixels: megapixels.toFixed(2),
            id: createdPhoto.id,
            contentHash: createdPhoto.content_hash,
        }
    }
}
