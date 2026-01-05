import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-static"
import { PhotoService } from "@/server/services/photo-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || "all"

    const photos = await PhotoService.getPhotos({ search, tag })

    return NextResponse.json({ photos })
  } catch (error) {
    console.error("Error en GET /api/photos:", error)
    const message = error instanceof Error ? error.message : "Error al procesar la solicitud"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
