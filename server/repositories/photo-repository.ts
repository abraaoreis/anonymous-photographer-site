import { createClient } from "@/lib/supabase/server"
import { Photo, PhotoFilters } from "../models/photo"
import { IPhotoRepository } from "./interfaces/photo-repository.interface"

export class SupabasePhotoRepository implements IPhotoRepository {
    async findMany(filters: PhotoFilters = {}): Promise<Photo[]> {
        const { search, tag } = filters
        const supabase = await createClient()

        let query = supabase.from("photos").select("id, url, name, category, width, height, megapixels, tags, camera, aperture, lens_type, location, description").order("created_at", { ascending: false })

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
}
