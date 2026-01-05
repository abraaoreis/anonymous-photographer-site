import { type NextRequest, NextResponse } from "next/server"
import { PhotoService } from "@/server/services/photo-service"

export const dynamic = "force-static"

export async function generateStaticParams() {
    return [{ id: 'dummy' }]
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await PhotoService.recordDownload(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error en POST /api/photos/[id]/download:", error)
        return NextResponse.json({ error: "Error al registrar descarga" }, { status: 500 })
    }
}
