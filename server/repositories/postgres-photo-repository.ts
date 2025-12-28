import { Pool } from "pg"
import { Photo, PhotoFilters } from "../models/photo"
import { IPhotoRepository } from "./interfaces/photo-repository.interface"

export class PostgresPhotoRepository implements IPhotoRepository {
    private pool: Pool

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.LOCAL_DB_URL,
        })
    }

    async findMany(filters: PhotoFilters = {}): Promise<Photo[]> {
        const { search, tag } = filters
        let query = "SELECT id, url, name, category, width, height, megapixels, tags, camera, aperture, lens_type, location, description, views_count, downloads_count FROM photos"
        const values: any[] = []
        const conditions: string[] = []

        if (search) {
            values.push(`%${search}%`)
            conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length} OR category ILIKE $${values.length} OR content_hash ILIKE $${values.length})`)
        }

        if (tag && tag !== "all") {
            values.push(tag)
            conditions.push(`(category = $${values.length} OR $${values.length} = ANY(tags))`)
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ")
        }

        query += " ORDER BY created_at DESC"

        try {
            const { rows } = await this.pool.query(query, values)
            return rows as Photo[]
        } catch (error) {
            console.error("Error in PostgresPhotoRepository.findMany:", error)
            throw new Error(`Error en base de datos local: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    async create(photoData: Partial<Photo>): Promise<Photo> {
        const columns = Object.keys(photoData)
        const values = Object.values(photoData)
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

        const sql = `INSERT INTO photos (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`

        try {
            const { rows } = await this.pool.query(sql, values)
            return rows[0] as Photo
        } catch (error) {
            console.error("Error in PostgresPhotoRepository.create:", error)
            throw new Error(`Error al guardar en base de datos local: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    async findById(id: string): Promise<Photo | null> {
        const query = "SELECT id, url, name, category, width, height, megapixels, tags, camera, aperture, lens_type, location, description, views_count, downloads_count FROM photos WHERE id = $1"
        try {
            const { rows } = await this.pool.query(query, [id])
            if (rows.length === 0) return null
            return rows[0] as Photo
        } catch (error) {
            console.error("Error in PostgresPhotoRepository.findById:", error)
            throw new Error(`Error al buscar en base de datos local: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    async incrementViews(id: string): Promise<void> {
        const query = "UPDATE photos SET views_count = views_count + 1 WHERE id = $1"
        try {
            await this.pool.query(query, [id])
        } catch (error) {
            console.error("Error in PostgresPhotoRepository.incrementViews:", error)
        }
    }

    async incrementDownloads(id: string): Promise<void> {
        const query = "UPDATE photos SET downloads_count = downloads_count + 1 WHERE id = $1"
        try {
            await this.pool.query(query, [id])
        } catch (error) {
            console.error("Error in PostgresPhotoRepository.incrementDownloads:", error)
        }
    }
}
