"use client"

import type React from "react"
import { Search, Upload, ImageIcon, Loader2, Download, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { usePhotoGallery } from "./use-photo-gallery"
import { UploadModal } from "../upload-modal/upload-modal"

const tags = [
  { id: "all", label: "Todas" },
  { id: "nature", label: "Naturaleza" },
  { id: "urban", label: "Urbano" },
  { id: "portrait", label: "Retrato" },
  { id: "abstract", label: "Abstracto" },
  { id: "architecture", label: "Arquitectura" },
]

export function PhotoGallery() {
  const {
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
  } = usePhotoGallery()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-[1920px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-title font-bold text-foreground">Fotógrafo Anónimo</h1>
          </div>
          <p className="text-xl text-light-gray mb-8 max-w-2xl mx-auto font-sans">
            Comparte tus mejores fotografías de forma anónima. Galería de imágenes de alta resolución para todos.
          </p>
          <div className="mt-4">
            <button className="btn bg-shadow-red hover:bg-[#C43F3F] border-none text-white rounded-[8px] font-sans px-8" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-5 h-5 mr-2" />
              Subir tu Foto</button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-gray" />
                <Input
                  type="text"
                  placeholder="Buscar fotos de alta resolución..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-mist-gray border-border text-foreground focus:bg-mist-gray/80 rounded-[16px] placeholder:text-light-gray"
                />
              </div>
            </form>

            <Button className="h-12 px-6 bg-shadow-red hover:bg-[#C43F3F] text-white border-none rounded-[8px]" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Subir Foto
            </Button>
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.id ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-xs font-mono whitespace-nowrap transition-colors rounded-full ${selectedTag === tag.id
                  ? "bg-shadow-red text-white border-shadow-red"
                  : "bg-[var(--tag-bg)] text-[var(--tag-text)] border-border hover:bg-[var(--tag-bg)]/70"
                  }`}
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
            <Loader2 className="w-10 h-10 animate-spin text-shadow-red" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mist-gray mb-6">
              <ImageIcon className="w-10 h-10 text-light-gray" />
            </div>
            <h2 className="text-2xl font-title font-semibold text-foreground mb-2">
              {appliedSearch ? "No se encontraron fotos" : "No hay fotos todavía"}
            </h2>
            <p className="text-light-gray font-sans">
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
                className="break-inside-avoid group relative overflow-hidden rounded-lg bg-card cursor-pointer hover:opacity-95 transition-all border border-[var(--card-border)] shadow-[var(--card-shadow)]"
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.name || photo.filename}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-urban-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-soft-white font-sans font-medium text-sm mb-1 truncate">{photo.name || photo.filename}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-light-gray">
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
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-soft-white/10 hover:bg-soft-white/20 text-soft-white border-none backdrop-blur-sm">
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
