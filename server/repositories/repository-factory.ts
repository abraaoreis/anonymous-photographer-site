import { IStorageRepository } from "./interfaces/storage-repository.interface"
import { SupabaseStorageRepository } from "./supabase-storage-repository"

export class RepositoryFactory {
    static getStorageRepository(): IStorageRepository {
        // We now use Supabase for all environments
        return new SupabaseStorageRepository()
    }
}
