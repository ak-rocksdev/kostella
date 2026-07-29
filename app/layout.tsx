import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

/* Archivo carries the brand: property and room numbers are set in its Expanded
   width (font-stretch 125%). That needs the variable font's `wdth` axis, not a
   static cut. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kostella — Beranda',
  description:
    'Kos milik dan dikelola sendiri sejak 2008. 31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${archivo.variable} ${jakarta.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
