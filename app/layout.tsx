import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Honey Palace - Nature's Sweetest Gift | Pure Honey from Kerala",
  description:
    "Premium quality raw honey and natural beeswax products from Wandoor, Kerala. Founded by Nafeesa TM. 100% natural, FSSAI certified, supporting women entrepreneurs.",
  keywords: "honey, raw honey, natural honey, beeswax, Kerala honey, organic honey, pure honey, women entrepreneur",
  icons: {
    icon: "/favicon.ico",
    
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="honey-palace-theme"
        >
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
