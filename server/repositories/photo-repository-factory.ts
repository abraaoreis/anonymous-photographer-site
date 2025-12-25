import { IPhotoRepository } from "./interfaces/photo-repository.interface"
import { SupabasePhotoRepository } from "./photo-repository"
import { PostgresPhotoRepository } from "./postgres-photo-repository"

export class PhotoRepositoryFactory {
    private static instance: IPhotoRepository | null = null

    static getPhotoRepository(): IPhotoRepository {
        if (this.instance) return this.instance

        const strategy = process.env.DB_STRATEGY || "supabase"

        if (strategy === "local") {
            this.instance = new PostgresPhotoRepository()
        } else {
            this.instance = new SupabasePhotoRepository()
        }

        return this.instance
    }
}
