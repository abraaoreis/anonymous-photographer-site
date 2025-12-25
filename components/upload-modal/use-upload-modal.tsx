import { useUploadPhoto } from "@/hooks/use-photos"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { UploadModalProps } from "./type-upload-modal"



const useUploadModal = ({ isOpen, onClose, onSuccess }: UploadModalProps) => {
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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                // Resize image if needed (Max 4K)
                const resizedFile = await resizeImage(file, 3840, 2160)

                setSelectedFile(resizedFile)
                const url = URL.createObjectURL(resizedFile)
                setPreviewUrl(url)

                if (!formData.name) {
                    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
                    setFormData({ ...formData, name: nameWithoutExt })
                }
            } catch (error) {
                console.error("Error processing image:", error)
                toast({
                    title: "Error",
                    description: "Error al procesar la imagen. Inténtalo de nuevo.",
                    variant: "destructive",
                })
            }
        }
    }

    const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = () => {
                let width = img.width
                let height = img.height

                // Calculate new dimensions
                if (width > maxWidth || height > maxHeight) {
                    if (width / maxWidth > height / maxHeight) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    } else {
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
                } else {
                    // No resize needed
                    resolve(file)
                    return
                }

                const canvas = document.createElement("canvas")
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")

                if (!ctx) {
                    reject(new Error("Could not get canvas context"))
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        })
                        resolve(resizedFile)
                    } else {
                        reject(new Error("Canvas to Blob conversion failed"))
                    }
                }, file.type, 0.9) // 0.9 quality
            }
            img.onerror = (error) => reject(error)
        })
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

    return {
        handleFileSelect,
        handleSubmit,
        handleClose,
        formData,
        setFormData,
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        uploadMutation,
    }
}

export default useUploadModal