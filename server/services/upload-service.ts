import { UploadResult } from "../models/photo"
import { PhotoRepository } from "../repositories/photo-repository"
import { RepositoryFactory } from "../repositories/repository-factory"

export class UploadService {
    private static photoRepository = new PhotoRepository()
    private static storageRepository = RepositoryFactory.getStorageRepository()

    private static async getImageDimensions(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number }> {
        const blob = new Blob([arrayBuffer])
        const imageBitmap = await createImageBitmap(blob)

        return {
            width: imageBitmap.width,
            height: imageBitmap.height,
        }
    }

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

        if (!file) throw new Error("No se proporcionó ningún archivo")
        if (!name || !category) throw new Error("El nombre y la categoría son obligatorios")
        if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen")

        const MAX_SIZE = 10 * 1024 * 1024
        if (file.size > MAX_SIZE) throw new Error("La imagen no puede superar los 10MB")

        const arrayBuffer = await file.arrayBuffer()
        const { width, height } = await this.getImageDimensions(arrayBuffer)
        const megapixels = (width * height) / 1000000

        if (megapixels < 2) throw new Error("La resolución mínima es de 2 megapíxeles")
        if (megapixels > 16) throw new Error("La resolución máxima es de 16 megapíxeles")

        const blobUrl = await this.storageRepository.upload(file.name, file)

        const tags = tagsString
            ? tagsString.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
            : []

        await this.photoRepository.create({
            url: blobUrl,
            filename: file.name,
            name,
            category,
            camera: camera || null,
            aperture: aperture || null,
            lens_type: lensType || null,
            location: location || null,
            description: description || null,
            tags,
            size: file.size,
            width,
            height,
            megapixels: megapixels.toFixed(2),
        })

        return {
            success: true,
            url: blobUrl,
            filename: file.name,
            width,
            height,
            megapixels: megapixels.toFixed(2),
        }
    }
}
