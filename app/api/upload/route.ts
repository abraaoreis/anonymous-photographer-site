import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Helper para obtener dimensiones de imagen
async function getImageDimensions(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number }> {
  // Crear un blob a partir del buffer
  const blob = new Blob([arrayBuffer])
  const imageBitmap = await createImageBitmap(blob)

  return {
    width: imageBitmap.width,
    height: imageBitmap.height,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const camera = formData.get("camera") as string
    const aperture = formData.get("aperture") as string
    const lensType = formData.get("lensType") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const tagsString = formData.get("tags") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!name || !category) {
      return NextResponse.json({ error: "El nombre y la categoría son obligatorios" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 10MB)
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB en bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "La imagen no puede superar los 10MB" }, { status: 400 })
    }

    // Obtener dimensiones de la imagen
    const arrayBuffer = await file.arrayBuffer()
    const { width, height } = await getImageDimensions(arrayBuffer)
    const megapixels = (width * height) / 1000000

    // Validar resolución (mínimo 2MP, máximo 16MP)
    if (megapixels < 2) {
      return NextResponse.json({ error: "La resolución mínima es de 2 megapíxeles" }, { status: 400 })
    }

    if (megapixels > 16) {
      return NextResponse.json({ error: "La resolución máxima es de 16 megapíxeles" }, { status: 400 })
    }

    // Subir a Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : []

    const supabase = await createClient()
    const { error: dbError } = await supabase.from("photos").insert({
      url: blob.url,
      filename: file.name,
      name,
      category,
      camera: camera || null,
      aperture: aperture || null,
      lens_type: lensType || null,
      location: location || null,
      description: description || null,
      tags,
      size: file.size,
      width,
      height,
      megapixels: megapixels.toFixed(2),
    })

    if (dbError) {
      console.error("Error al guardar en base de datos:", dbError)
      return NextResponse.json({ error: "Error al guardar los metadatos de la foto" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
      width,
      height,
      megapixels: megapixels.toFixed(2),
    })
  } catch (error) {
    console.error("Error al subir:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}
