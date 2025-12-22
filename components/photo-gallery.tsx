"use client"

import type React from "react"
import { useState } from "react"
import { Search, Upload, ImageIcon, Loader2, Download, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UploadModal } from "@/components/upload-modal"
import { usePhotos } from "@/hooks/use-photos"

const tags = [
  { id: "all", label: "Todas" },
  { id: "nature", label: "Naturaleza" },
  { id: "urban", label: "Urbano" },
  { id: "portrait", label: "Retrato" },
  { id: "abstract", label: "Abstracto" },
  { id: "architecture", label: "Arquitectura" },
]

export function PhotoGallery() {
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const { data: photos = [], isLoading, refetch } = usePhotos({ search: appliedSearch, tag: selectedTag })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAppliedSearch(search)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-[1920px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg">
              <Camera className="w-8 h-8 text-neutral-900" />
            </div>
            <h1 className="text-5xl font-bold">Fotógrafo Anónimo</h1>
          </div>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Comparte tus mejores fotografías de forma anónima. Galería de imágenes de alta resolución para todos.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="w-5 h-5 mr-2" />
            Subir tu Foto
          </Button>

          {/* Test DaisyUI Component */}
          <div className="mt-4">
            <button className="btn btn-primary">Botão DaisyUI</button>
          </div>

          <p className="text-sm text-neutral-400 mt-4">Máximo 10MB • Resolución 2-16 Megapixeles</p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Buscar fotos de alta resolución..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-neutral-50 border-neutral-200 focus:bg-white rounded-[16px]"
                />
              </div>
            </form>

            <Button className="h-12 px-6" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Subir Foto
            </Button>
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm whitespace-nowrap hover:bg-neutral-100 transition-colors"
                onClick={() => setSelectedTag(tag.id)}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-neutral-300" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-6">
              <ImageIcon className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              {appliedSearch ? "No se encontraron fotos" : "No hay fotos todavía"}
            </h2>
            <p className="text-neutral-500">
              {appliedSearch
                ? "Intenta con otra búsqueda o usa los filtros de arriba"
                : "Haz clic en el botão 'Subir Foto' para compartir tu primeira fotografa"}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid group relative overflow-hidden rounded-lg bg-neutral-100 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.name || photo.filename}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium text-sm mb-1 truncate">{photo.name || photo.filename}</p>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>
                        {photo.width} × {photo.height}
                      </span>
                      <span>{photo.megapixels} MP</span>
                    </div>
                  </div>

                  <a
                    href={photo.url}
                    download={photo.filename}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
