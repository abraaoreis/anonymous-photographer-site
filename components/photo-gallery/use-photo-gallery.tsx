import { useState } from "react"
import { usePhotos } from "@/hooks/use-photos"
import { Photo } from "@/server/models/photo"
import { PhotoApi } from "@/services/frontend/photo-api"

export function usePhotoGallery() {
    const [search, setSearch] = useState("")
    const [appliedSearch, setAppliedSearch] = useState("")
    const [selectedTag, setSelectedTag] = useState<string>("all")
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [detailModalMode, setDetailModalMode] = useState<"preview" | "download">("preview")

    const { data: photos = [], isLoading, refetch } = usePhotos({ search: appliedSearch, tag: selectedTag })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setAppliedSearch(search)
    }

    const openPreview = async (photo: Photo) => {
        setSelectedPhoto(photo)
        setDetailModalMode("preview")
        setIsDetailModalOpen(true)
        // Record view asynchronously
        PhotoApi.recordView(photo.id).catch(console.error)
    }

    const openDownload = (photo: Photo) => {
        setSelectedPhoto(photo)
        setDetailModalMode("download")
        setIsDetailModalOpen(true)
    }

    return {
        search,
        setSearch,
        appliedSearch,
        selectedTag,
        setSelectedTag,
        isUploadModalOpen,
        setIsUploadModalOpen,
        photos,
        isLoading,
        refetch,
        handleSearch,
        selectedPhoto,
        isDetailModalOpen,
        setIsDetailModalOpen,
        detailModalMode,
        openPreview,
        openDownload,
    }
}
