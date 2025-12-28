"use client"

import { Photo } from "@/server/models/photo"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { PhotoApi } from "@/services/frontend/photo-api"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

interface PhotoDetailModalProps {
    photo: Photo | null
    isOpen: boolean
    onClose: () => void
    mode: "preview" | "download"
}

export function PhotoDetailModal({ photo, isOpen, onClose, mode }: PhotoDetailModalProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const { t } = useLanguage()

    if (!photo) return null

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            await PhotoApi.recordDownload(photo.id)

            // Trigger actual download
            const response = await fetch(photo.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = photo.filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            // Close the modal after download
            onClose()
        } catch (error) {
            console.error("Error downloading photo:", error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl !p-0 !overflow-hidden bg-background border-border text-foreground">
                <DialogHeader className="sr-only">
                    <DialogTitle>{photo.name}</DialogTitle>
                    <DialogDescription>
                        {t.modals.detail.previewTitle} - {photo.name}
                    </DialogDescription>
                </DialogHeader>

                {mode === "preview" ? (
                    <div className="flex flex-col max-h-[85vh]">
                        {/* Header with title */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold font-title truncate">{photo.name}</h2>
                                {photo.description && (
                                    <p className="text-sm text-light-gray truncate mt-1">{photo.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Photo display area */}
                        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 overflow-hidden bg-background">
                            <img
                                src={photo.url}
                                alt={photo.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Footer with stats and download */}
                        <div className="px-6 py-4 bg-background/95 backdrop-blur-sm border-t border-border flex-shrink-0">
                            {/* Stats row */}
                            <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm mb-4 flex-wrap">
                                {/* Views */}
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-light-gray flex-shrink-0" />
                                    <span className="text-light-gray hidden sm:inline">Visualizações:</span>
                                    <span className="font-mono font-semibold">{photo.views_count || 0}</span>
                                </div>

                                {/* Downloads */}
                                <div className="flex items-center gap-1.5">
                                    <Download className="w-4 h-4 text-light-gray flex-shrink-0" />
                                    <span className="text-light-gray hidden sm:inline">Downloads:</span>
                                    <span className="font-mono font-semibold">{photo.downloads_count || 0}</span>
                                </div>
                            </div>

                            {/* Download button */}
                            <Button
                                onClick={handleDownload}
                                className="w-full bg-shadow-red hover:bg-[#C43F3F] text-white h-12 text-base font-semibold transition-all hover:shadow-lg"
                                disabled={isDownloading}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {isDownloading ? "Baixando..." : t.modals.detail.buttons.downloadFree}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 px-6 space-y-6">
                        <div className="w-20 h-20 bg-shadow-red/10 rounded-full flex items-center justify-center mx-auto">
                            <Download className="w-10 h-10 text-shadow-red animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold font-title">{t.modals.detail.donation.title}</h2>
                            <p className="text-light-gray max-w-md mx-auto">
                                {t.modals.detail.donation.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="h-12 border-border hover:bg-mist-gray"
                                disabled={isDownloading}
                            >
                                {t.modals.detail.buttons.justDownload}
                            </Button>
                            <Button className="h-12 bg-shadow-red hover:bg-[#C43F3F] text-white">
                                {t.modals.detail.buttons.donateAndDownload}
                            </Button>
                        </div>

                        <p className="text-[10px] text-light-gray font-mono uppercase tracking-widest pt-4">
                            {photo.views_count || 0} {t.gallery.stats.views.toLowerCase()} • {photo.downloads_count || 0} {t.gallery.stats.downloads.toLowerCase()}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
