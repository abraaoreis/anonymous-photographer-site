"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { ThemeProvider } from "./theme-provider"
import { LanguageProvider } from "@/lib/language-context"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minuto
            },
        },
    }))

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
