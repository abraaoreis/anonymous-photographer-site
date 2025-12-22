import { put } from "@vercel/blob"
import { IStorageRepository } from "./interfaces/storage-repository.interface"

export class VercelBlobRepository implements IStorageRepository {
    async upload(name: string, file: File): Promise<string> {
        const blob = await put(name, file, { access: "public" })
        return blob.url
    }
}
