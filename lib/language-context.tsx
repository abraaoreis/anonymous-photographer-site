"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { en } from "./locales/en"
import { es } from "./locales/es"
import { pt } from "./locales/pt"

type Language = "en" | "es" | "pt"
type Translations = typeof en

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: Translations
}

const translations: Record<Language, Translations> = { en, es, pt }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>("es") // Default to Spanish as requested/existing

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language
        if (savedLang && translations[savedLang]) {
            setLanguageState(savedLang)
        } else {
            // Try to detect browser language
            const browserLang = navigator.language.split("-")[0]
            if (browserLang === "pt") setLanguageState("pt")
            else if (browserLang === "en") setLanguageState("en")
            else setLanguageState("es")
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("language", lang)
    }

    const t = translations[language]

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
