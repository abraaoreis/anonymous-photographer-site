"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PhotoApi } from "@/services/frontend/photo-api"
import { PhotoFilters } from "@/server/models/photo"

export function usePhotos(filters: PhotoFilters = {}) {
    return useQuery({
        queryKey: ["photos", filters],
        queryFn: () => PhotoApi.getPhotos(filters),
    })
}

export function useUploadPhoto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (formData: FormData) => PhotoApi.uploadPhoto(formData),
        onSuccess: () => {
            // Invalida o cache para atualizar a galeria
            queryClient.invalidateQueries({ queryKey: ["photos"] })
        },
    })
}
