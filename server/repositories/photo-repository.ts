import { createClient } from "@/lib/supabase/server"
import { Photo, PhotoFilters } from "../models/photo"

export class PhotoRepository {
    async findMany(filters: PhotoFilters = {}): Promise<Photo[]> {
        const { search, tag } = filters
        const supabase = await createClient()

        let query = supabase.from("photos").select("*").order("created_at", { ascending: false })

        if (search) {
            query = query.ilike("name", `%${search}%`)
        }

        if (tag && tag !== "all") {
            query = query.contains("tags", [tag])
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Error en base de datos: ${error.message}`)
        }

        return data as Photo[]
    }

    async create(photoData: any): Promise<void> {
        const supabase = await createClient()
        const { error } = await supabase.from("photos").insert(photoData)

        if (error) {
            throw new Error(`Error al guardar en base de datos: ${error.message}`)
        }
    }
}
