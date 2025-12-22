"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadPhoto } from "@/hooks/use-photos"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const { toast } = useToast()

  const uploadMutation = useUploadPhoto()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    camera: "",
    aperture: "",
    lensType: "",
    location: "",
    description: "",
    tags: "",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      if (!formData.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
        setFormData({ ...formData, name: nameWithoutExt })
      }
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFormData({
      name: "",
      category: "",
      camera: "",
      aperture: "",
      lensType: "",
      location: "",
      description: "",
      tags: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una foto",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "El nombre y la categoría son obligatorios",
        variant: "destructive",
      })
      return
    }

    const data = new FormData()
    data.append("file", selectedFile)
    data.append("name", formData.name)
    data.append("category", formData.category)
    data.append("camera", formData.camera)
    data.append("aperture", formData.aperture)
    data.append("lensType", formData.lensType)
    data.append("location", formData.location)
    data.append("description", formData.description)
    data.append("tags", formData.tags)

    uploadMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Foto enviada con éxito",
          description: "Tu fotografía ha sido publicada en la galería",
        })
        resetForm()
        onSuccess()
        onClose()
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al subir la imagen",
          variant: "destructive",
        })
      }
    })
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subir Fotografía</DialogTitle>
          <DialogDescription>
            Completa los detalles de tu fotografía. Los campos obligatorios están marcados con *
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label htmlFor="photo-file">Foto *</Label>
            <div className="mt-2">
              {previewUrl ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-neutral-200">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl("")
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="photo-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                >
                  <ImagePlus className="w-12 h-12 text-neutral-400 mb-3" />
                  <p className="text-sm text-neutral-600 font-medium">Haz clic para seleccionar una foto</p>
                  <p className="text-xs text-neutral-500 mt-1">Máximo 10MB • 2-16 Megapixeles</p>
                </label>
              )}
              <input id="photo-file" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Nombre de la Foto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Atardecer en la montaña"
              required
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nature">Naturaleza</SelectItem>
                <SelectItem value="urban">Urbano</SelectItem>
                <SelectItem value="portrait">Retrato</SelectItem>
                <SelectItem value="abstract">Abstracto</SelectItem>
                <SelectItem value="architecture">Arquitectura</SelectItem>
                <SelectItem value="wildlife">Vida Silvestre</SelectItem>
                <SelectItem value="street">Calle</SelectItem>
                <SelectItem value="landscape">Paisaje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Camera Info Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camera">Cámara</Label>
              <Input
                id="camera"
                value={formData.camera}
                onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                placeholder="Ej: Canon EOS R5"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="aperture">Apertura de Lente</Label>
              <Input
                id="aperture"
                value={formData.aperture}
                onChange={(e) => setFormData({ ...formData, aperture: e.target.value })}
                placeholder="Ej: f/2.8"
                className="mt-2"
              />
            </div>
          </div>

          {/* Lens Type */}
          <div>
            <Label htmlFor="lensType">Tipo de Lente</Label>
            <Input
              id="lensType"
              value={formData.lensType}
              onChange={(e) => setFormData({ ...formData, lensType: e.target.value })}
              placeholder="Ej: 24-70mm f/2.8"
              className="mt-2"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Localización</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Barcelona, España"
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cuéntanos más sobre esta fotografía..."
              rows={3}
              className="mt-2 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ej: atardecer, montaña, paisaje (separadas por comas)"
              className="mt-2"
            />
            <p className="text-xs text-neutral-500 mt-1">Separa las etiquetas con comas</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending || !selectedFile} className="flex-1">
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Foto
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
