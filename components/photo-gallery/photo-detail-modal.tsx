"use client"

import { Photo } from "@/server/models/photo"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye, Heart, Share2, Info, Camera, MapPin, Calendar, Layers } from "lucide-react"
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
            <DialogContent className="max-w-4xl bg-background border-border text-foreground">
                <DialogHeader className="sr-only">
                    <DialogTitle>{mode === "preview" ? photo.name : t.modals.detail.downloadTitle}</DialogTitle>
                    <DialogDescription>
                        {mode === "preview"
                            ? `${t.modals.detail.previewTitle} - ${photo.name}`
                            : t.modals.detail.downloadTitle}
                    </DialogDescription>
                </DialogHeader>
                {mode === "preview" ? (
                    <div className="space-y-6">
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-mist-gray">
                            <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <h2 className="text-2xl font-bold font-title">{photo.name}</h2>
                                <p className="text-light-gray">{photo.description || t.modals.detail.noDescription}</p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {photo.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-mist-gray rounded-full text-xs font-mono text-light-gray">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 bg-mist-gray/30 p-4 rounded-lg border border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-light-gray"><Eye className="w-4 h-4" /> {t.modals.detail.stats.views}</span>
                                    <span className="font-mono">{photo.views_count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-light-gray"><Download className="w-4 h-4" /> {t.modals.detail.stats.downloads}</span>
                                    <span className="font-mono">{photo.downloads_count || 0}</span>
                                </div>

                                <div className="pt-2 border-t border-border space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-light-gray">
                                        <Camera className="w-3 h-3" /> {photo.camera || t.modals.detail.info.unknown}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-light-gray">
                                        <MapPin className="w-3 h-3" /> {photo.location || t.modals.detail.info.unknown}
                                    </div>
                                </div>

                                <Button onClick={handleDownload} className="w-full bg-shadow-red hover:bg-[#C43F3F] text-white" disabled={isDownloading}>
                                    <Download className="w-4 h-4 mr-2" /> {t.modals.detail.buttons.downloadFree}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-6">
                        <div className="w-20 h-20 bg-shadow-red/10 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="w-10 h-10 text-shadow-red animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold font-title">{t.modals.detail.donation.title}</h2>
                            <p className="text-light-gray max-w-md mx-auto">
                                {t.modals.detail.donation.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
                            <Button onClick={handleDownload} variant="outline" className="h-12 border-border hover:bg-mist-gray" disabled={isDownloading}>
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
