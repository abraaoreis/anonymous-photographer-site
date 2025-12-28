import { createClient } from "@/lib/supabase/server"
import { Photo, PhotoFilters } from "../models/photo"
import { IPhotoRepository } from "./interfaces/photo-repository.interface"

export class SupabasePhotoRepository implements IPhotoRepository {
    async findMany(filters: PhotoFilters = {}): Promise<Photo[]> {
        const { search, tag } = filters
        const supabase = await createClient()

        let query = supabase.from("photos").select("id, url, name, category, width, height, megapixels, tags, camera, aperture, lens_type, location, description, views_count, downloads_count").order("created_at", { ascending: false })

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%,content_hash.ilike.%${search}%`)
        }

        if (tag && tag !== "all") {
            query = query.or(`category.eq.${tag},tags.cs.{${tag}}`)
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Error en base de datos: ${error.message}`)
        }

        return data as Photo[]
    }

    async create(photoData: any): Promise<Photo> {
        const supabase = await createClient()
        const { data, error } = await supabase.from("photos").insert(photoData).select().single()

        if (error) {
            throw new Error(`Error al guardar en base de datos: ${error.message}`)
        }

        return data as Photo
    }

    async findById(id: string): Promise<Photo | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("photos")
            .select("id, url, name, category, width, height, megapixels, tags, camera, aperture, lens_type, location, description, views_count, downloads_count")
            .eq("id", id)
            .single()

        if (error) return null
        return data as Photo
    }

    async incrementViews(id: string): Promise<void> {
        const supabase = await createClient()
        await supabase.rpc('increment_views', { photo_id: id })
        // If RPC doesn't exist, we could use a regular update, but let's assume RPC is preferred for atomic increments
        // actually for simplicity let's use:
        const photo = await this.findById(id)
        if (photo) {
            await supabase.from("photos").update({ views_count: (photo.views_count || 0) + 1 }).eq("id", id)
        }
    }

    async incrementDownloads(id: string): Promise<void> {
        const supabase = await createClient()
        const photo = await this.findById(id)
        if (photo) {
            await supabase.from("photos").update({ downloads_count: (photo.downloads_count || 0) + 1 }).eq("id", id)
        }
    }
}
