"use client"

import type React from "react"
import { X, Upload, Loader2, ImagePlus, CheckCircle2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useUploadModal from "./use-upload-modal"
import { UploadModalProps } from "./type-upload-modal"
import { useLanguage } from "@/lib/language-context"


export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const { handleFileSelect, handleSubmit, handleClose, formData, setFormData, selectedFile, setSelectedFile, previewUrl, setPreviewUrl, uploadMutation, successData, resetForm } = useUploadModal({ isOpen, onClose, onSuccess })
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{successData ? t.modals.upload.successTitle : t.modals.upload.title}</DialogTitle>
          <DialogDescription>
            {successData
              ? t.modals.upload.successDescription
              : t.modals.upload.description}
          </DialogDescription>
        </DialogHeader>

        {successData ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center text-center p-6 bg-mist-gray/30 rounded-lg border border-border/50">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{t.modals.upload.receiptTitle}</h3>
              <p className="text-sm text-light-gray mb-6">{t.modals.upload.receiptDescription}</p>

              <div className="w-full relative group">
                <div className="bg-urban-black p-4 rounded-md font-mono text-[10px] break-all border border-border text-soft-white/80 pr-12">
                  {successData.contentHash}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-soft-white/10"
                  onClick={() => {
                    navigator.clipboard.writeText(successData.contentHash)
                    // We could add a "Copied!" state here if we wanted
                  }}
                >
                  <Copy className="w-4 h-4 text-light-gray" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  resetForm()
                  handleClose()
                }}
                className="w-full bg-shadow-red hover:bg-[#C43F3F] text-white border-none"
              >
                {t.modals.upload.buttons.close}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="w-full border-border text-light-gray hover:text-foreground hover:bg-mist-gray/50"
              >
                {t.modals.upload.buttons.uploadAnother}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <Label htmlFor="photo-file" className="text-foreground font-sans font-medium">{t.modals.upload.form.photo} *</Label>
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
                    <p className="text-sm text-foreground font-medium font-sans">{t.modals.upload.form.clickToSelect}</p>
                    <p className="text-xs text-light-gray mt-1 font-mono">{t.modals.upload.form.constraints}</p>
                  </label>
                )}
                <input id="photo-file" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-foreground font-sans font-medium">{t.modals.upload.form.name} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.modals.upload.form.namePlaceholder}
                required
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-foreground font-sans font-medium">{t.modals.upload.form.category} *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-2 bg-mist-gray border-border text-foreground">
                  <SelectValue placeholder={t.modals.upload.form.selectCategory} />
                </SelectTrigger>
                <SelectContent className="bg-mist-gray border-border text-foreground">
                  <SelectItem value="nature">{t.search.tags.nature}</SelectItem>
                  <SelectItem value="urban">{t.search.tags.urban}</SelectItem>
                  <SelectItem value="portrait">{t.search.tags.portrait}</SelectItem>
                  <SelectItem value="abstract">{t.search.tags.abstract}</SelectItem>
                  <SelectItem value="architecture">{t.search.tags.architecture}</SelectItem>
                  <SelectItem value="wildlife">{t.search.tags.wildlife}</SelectItem>
                  <SelectItem value="street">{t.search.tags.street}</SelectItem>
                  <SelectItem value="landscape">{t.search.tags.landscape}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Camera Info Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="camera" className="text-soft-white font-sans font-medium">{t.modals.upload.form.camera}</Label>
                <Input
                  id="camera"
                  value={formData.camera}
                  onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                  placeholder={t.modals.upload.form.cameraPlaceholder}
                  className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
                />
              </div>
              <div>
                <Label htmlFor="aperture" className="text-foreground font-sans font-medium">{t.modals.upload.form.aperture}</Label>
                <Input
                  id="aperture"
                  value={formData.aperture}
                  onChange={(e) => setFormData({ ...formData, aperture: e.target.value })}
                  placeholder={t.modals.upload.form.aperturePlaceholder}
                  className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
                />
              </div>
            </div>

            {/* Lens Type */}
            <div>
              <Label htmlFor="lensType" className="text-foreground font-sans font-medium">{t.modals.upload.form.lens}</Label>
              <Input
                id="lensType"
                value={formData.lensType}
                onChange={(e) => setFormData({ ...formData, lensType: e.target.value })}
                placeholder={t.modals.upload.form.lensPlaceholder}
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-foreground font-sans font-medium">{t.modals.upload.form.location}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t.modals.upload.form.locationPlaceholder}
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-soft-white font-sans font-medium">{t.modals.upload.form.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t.modals.upload.form.descriptionPlaceholder}
                rows={3}
                className="mt-2 resize-none bg-mist-gray border-mist-gray text-soft-white placeholder:text-light-gray"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-soft-white font-sans font-medium">{t.modals.upload.form.tags}</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={t.modals.upload.form.tagsPlaceholder}
                className="mt-2 bg-mist-gray border-border text-foreground placeholder:text-light-gray"
              />
              <p className="text-[10px] text-light-gray mt-1 font-mono">{t.modals.upload.form.tagsHint}</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent border-[var(--secondary-button-border)] text-light-gray hover:border-foreground hover:text-foreground rounded-[8px]">
                {t.modals.upload.buttons.cancel}
              </Button>
              <Button type="submit" disabled={uploadMutation.isPending || !selectedFile} className="flex-1 bg-shadow-red hover:bg-[#C43F3F] text-white border-none font-sans font-bold rounded-[8px]">
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.modals.upload.buttons.uploading}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.modals.upload.buttons.upload}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
