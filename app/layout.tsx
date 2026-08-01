import type { Metadata } from 'next'
import { Archivo, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { positioningSentence } from '@/lib/content/company'

/* Archivo carries the brand twice over, distinguished by width rather than by
   being a different family:
     - property and room numbers in its Expanded width (font-stretch 125%)
     - prices, codes, and receipts at normal width
   Both need the variable font's `wdth` axis, not a static cut. */
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

export const metadata: Metadata = {
  title: 'Kostella — Beranda',
  description: `${positioningSentence} Kamar yang tampil di sini benar-benar kosong hari ini.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${archivo.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}
