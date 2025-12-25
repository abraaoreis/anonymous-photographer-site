import { IStorageRepository } from "./interfaces/storage-repository.interface"
import { VercelBlobRepository } from "./vercel-blob-repository"
import { S3StorageRepository } from "./s3-storage-repository"

export class RepositoryFactory {
    static getStorageRepository(): IStorageRepository {
        const strategy = process.env.DB_STRATEGY || "supabase"

        if (strategy === "local") {
            return new S3StorageRepository()
        }

        return new VercelBlobRepository()
    }
}
