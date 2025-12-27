import { useUploadPhoto } from "@/hooks/use-photos"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { UploadModalProps } from "./type-upload-modal"

interface ImageData {
    file: File;
    width: number;
    height: number;
    hash: string;
}



const useUploadModal = ({ isOpen, onClose, onSuccess }: UploadModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imageMetadata, setImageMetadata] = useState<{ width: number; height: number; hash: string } | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [successData, setSuccessData] = useState<{ id: string; contentHash: string } | null>(null)
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
                // Resize image if needed (Max 4K) and get metadata
                const result = await processImage(file)

                setSelectedFile(result.file)
                setImageMetadata({
                    width: result.width,
                    height: result.height,
                    hash: result.hash
                })

                const url = URL.createObjectURL(result.file)
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

    const generateHash = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    }

    const processImage = (file: File): Promise<ImageData> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = async () => {
                let width = img.width
                let height = img.height
                const maxWidth = 3840
                const maxHeight = 2160

                // Calculate new dimensions
                if (width > maxWidth || height > maxHeight) {
                    if (width / maxWidth > height / maxHeight) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    } else {
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
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

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const processedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        })

                        try {
                            const hash = await generateHash(processedFile)
                            resolve({
                                file: processedFile,
                                width,
                                height,
                                hash
                            })
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        reject(new Error("Canvas to Blob conversion failed"))
                    }
                }, file.type, 0.9)
            }
            img.onerror = (error) => reject(error)
        })
    }

    const resetForm = () => {
        setSelectedFile(null)
        setPreviewUrl("")
        setSuccessData(null)
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

        if (imageMetadata) {
            data.append("width", imageMetadata.width.toString())
            data.append("height", imageMetadata.height.toString())
            data.append("hash", imageMetadata.hash)
        }

        uploadMutation.mutate(data, {
            onSuccess: (result) => {
                toast({
                    title: "Foto enviada con éxito",
                    description: "Tu fotografía ha sido publicada en la galería",
                })
                if (result.id && result.contentHash) {
                    setSuccessData({ id: result.id, contentHash: result.contentHash })
                }
                onSuccess()
                // Don't close immediately if we have success data to show
                if (!result.contentHash) {
                    onClose()
                }
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
        successData,
        resetForm,
    }
}

export default useUploadModal