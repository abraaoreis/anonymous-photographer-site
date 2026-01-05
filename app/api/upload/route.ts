import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-static"
import { UploadService } from "@/server/services/upload-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await UploadService.uploadPhoto(formData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en POST /api/upload:", error)
    const message = error instanceof Error ? error.message : "Error al subir la imagen"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
