import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, IBM_Plex_Mono, Playfair_Display, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: {
    default: "Silent Shutter",
    template: "%s | Silent Shutter",
  },
  description:
    "Explore high-quality anonymous photography by Silent Shutter. Free stock photos for personal and commercial use.",
  keywords: [
    "photography",
    "stock photos",
    "anonymous",
    "silent shutter",
    "pexels",
    "pinterest",
    "free photos",
    "high quality",
    "art",
    "gallery",
    "creative commons",
  ],
  authors: [{ name: "Silent Shutter" }],
  creator: "Silent Shutter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://silent-shutter.APP_URL_PLACEHOLDER",
    title: "Silent Shutter - Anonymous Photography",
    description: "Explore high-quality anonymous photography by Silent Shutter. Free for personal and commercial use.",
    siteName: "Silent Shutter",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Silent Shutter Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Shutter",
    description: "Explore high-quality anonymous photography by Silent Shutter.",
    images: ["/og-image.jpg"],
    creator: "@silentshutter",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://silent-shutter.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${playfairDisplay.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <ThemeToggle />
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
