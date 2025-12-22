import { IStorageRepository } from "./interfaces/storage-repository.interface"
import { VercelBlobRepository } from "./vercel-blob-repository"
import { LocalStorageRepository } from "./local-storage-repository"

export class RepositoryFactory {
    static getStorageRepository(): IStorageRepository {
        const strategy = process.env.DB_STRATEGY || "supabase"

        // Podemos usar a mesma variável de estratégia ou uma nova para storage
        if (strategy === "local") {
            return new LocalStorageRepository()
        }

        return new VercelBlobRepository()
    }
}
