"use client"

import { useLanguage } from "@/lib/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "es", label: "Español", flag: "🇪🇸" },
        { code: "pt", label: "Português", flag: "🇧🇷" },
    ]

    const currentLang = languages.find(l => l.code === language)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="bg-mist-gray/50 hover:bg-mist-gray border border-border/50 text-foreground transition-all duration-300 rounded-full px-4"
                >
                    <Globe className="w-4 h-4 mr-2 text-shadow-red" />
                    <span className="mr-2 uppercase text-[10px] font-mono font-bold tracking-widest">{language}</span>
                    <span className="text-lg leading-none">{currentLang?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-urban-black border-border shadow-2xl p-1 min-w-[140px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-colors ${language === lang.code ? "bg-mist-gray text-shadow-red" : "hover:bg-mist-gray/50 text-soft-white"
                            }`}
                    >
                        <span className="text-sm font-sans">{lang.label}</span>
                        <span className="text-lg">{lang.flag}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
