"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevenir erros de hidratação
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-shadow-red hover:bg-shadow-red/90 text-soft-white border-none shadow-[var(--modal-shadow)] transition-all duration-300 hover:scale-110 active:scale-95"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
                {theme === "dark" ? (
                    <Sun className="h-6 w-6" />
                ) : (
                    <Moon className="h-6 w-6" />
                )}
            </Button>
        </div>
    )
}
