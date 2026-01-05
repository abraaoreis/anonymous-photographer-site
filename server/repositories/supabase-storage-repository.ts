import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { IStorageRepository } from "./interfaces/storage-repository.interface"

export class SupabaseStorageRepository implements IStorageRepository {
    private _supabase: SupabaseClient | null = null
    private bucketName = process.env.SUPABASE_STORAGE_BUCKET || "photos"

    private get supabase(): SupabaseClient {
        if (!this._supabase) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            if (!supabaseUrl || !supabaseKey) {
                throw new Error("Supabase configuration is missing (URL or Key)")
            }

            this._supabase = createClient(supabaseUrl, supabaseKey)
        }
        return this._supabase
    }

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
