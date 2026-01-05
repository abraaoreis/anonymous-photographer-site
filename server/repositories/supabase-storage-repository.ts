import { createClient } from "@supabase/supabase-js"
import { IStorageRepository } from "./interfaces/storage-repository.interface"

export class SupabaseStorageRepository implements IStorageRepository {
    private supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    private bucketName = process.env.SUPABASE_STORAGE_BUCKET || "photos"

    async upload(name: string, file: File): Promise<string> {
        // Create a unique path to avoid collisions
        const timestamp = Date.now()
        const path = `${timestamp}-${name}`

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error("Supabase storage upload error:", error)
            throw new Error(`Error al subir a Supabase Storage: ${error.message}`)
        }

        const { data: { publicUrl } } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(data.path)

        return publicUrl
    }
}
