import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""

    const supabase = await createClient()

    let query = supabase.from("photos").select("*").order("created_at", { ascending: false })

    // Si hay búsqueda, filtrar por nombre de archivo
    if (search) {
      query = query.ilike("filename", `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error al obtener fotos:", error)
      return NextResponse.json({ error: "Error al obtener las fotos" }, { status: 500 })
    }

    return NextResponse.json({ photos: data || [] })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
