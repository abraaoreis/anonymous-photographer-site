import { type NextRequest, NextResponse } from "next/server"
import { PhotoService } from "@/server/services/photo-service"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        await PhotoService.recordView(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error en POST /api/photos/[id]/view:", error)
        return NextResponse.json({ error: "Error al registrar vista" }, { status: 500 })
    }
}
