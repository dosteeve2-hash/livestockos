import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LivestockOS — FORGE Afrika',
  description: "Gestion de l'élevage pour PME africaines",
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/android-chrome-192x192.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
