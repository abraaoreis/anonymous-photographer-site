"use client"

import type React from "react"
import { X, Upload, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useUploadModal from "./use-upload-modal"
import { UploadModalProps } from "./type-upload-modal"


export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const { handleFileSelect, handleSubmit, handleClose, formData, setFormData, selectedFile, setSelectedFile, previewUrl, setPreviewUrl, uploadMutation } = useUploadModal({ isOpen, onClose, onSuccess })

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Fotografía</DialogTitle>
          <DialogDescription>
            Completa los detalles de tu fotografía. Los campos obligatorios están marcados con *
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label htmlFor="photo-file" className="text-foreground font-sans font-medium">Foto *</Label>
            <div className="mt-2 text-foreground">
              {previewUrl ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 bg-urban-black/50 hover:bg-urban-black/70 text-soft-white border-none"
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
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-light-gray hover:bg-mist-gray/50 transition-colors"
                >
                  <ImagePlus className="w-12 h-12 text-light-gray mb-3" />
                  <p className="text-sm text-foreground font-medium font-sans">Haz clic para seleccionar una foto</p>
                  <p className="text-xs text-light-gray mt-1 font-mono">Máximo 10MB • 2-16 Megapixeles</p>
                </label>
              )}
              <input id="photo-file" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-foreground font-sans font-medium">Nombre de la Foto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Atardecer en la montaña"
              required
              className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-foreground font-sans font-medium">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-2 bg-mist-gray border-border text-foreground">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-mist-gray border-border text-foreground">
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
              <Label htmlFor="camera" className="text-soft-white font-sans font-medium">Cámara</Label>
              <Input
                id="camera"
                value={formData.camera}
                onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                placeholder="Ej: Canon EOS R5"
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
            </div>
            <div>
              <Label htmlFor="aperture" className="text-foreground font-sans font-medium">Apertura de Lente</Label>
              <Input
                id="aperture"
                value={formData.aperture}
                onChange={(e) => setFormData({ ...formData, aperture: e.target.value })}
                placeholder="Ej: f/2.8"
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
            </div>
          </div>

          {/* Lens Type */}
          <div>
            <Label htmlFor="lensType" className="text-foreground font-sans font-medium">Tipo de Lente</Label>
            <Input
              id="lensType"
              value={formData.lensType}
              onChange={(e) => setFormData({ ...formData, lensType: e.target.value })}
              placeholder="Ej: 24-70mm f/2.8"
              className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-foreground font-sans font-medium">Localización</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Barcelona, España"
              className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-soft-white font-sans font-medium">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cuéntanos más sobre esta fotografía..."
              rows={3}
              className="mt-2 resize-none bg-mist-gray border-mist-gray text-soft-white placeholder:text-light-gray"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-soft-white font-sans font-medium">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ej: atardecer, montaña, paisaje (separadas por comas)"
              className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
            />
            <p className="text-[10px] text-light-gray mt-1 font-mono">Separa las etiquetas con comas</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent border-[var(--secondary-button-border)] text-light-gray hover:border-foreground hover:text-foreground rounded-[8px]">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending || !selectedFile} className="flex-1 bg-shadow-red hover:bg-[#C43F3F] text-white border-none font-sans font-bold rounded-[8px]">
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
