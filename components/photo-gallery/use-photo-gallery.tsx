import { useState } from "react"
import { usePhotos } from "@/hooks/use-photos"

export function usePhotoGallery() {
    const [search, setSearch] = useState("")
    const [appliedSearch, setAppliedSearch] = useState("")
    const [selectedTag, setSelectedTag] = useState<string>("all")
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    const { data: photos = [], isLoading, refetch } = usePhotos({ search: appliedSearch, tag: selectedTag })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setAppliedSearch(search)
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
    }
}
