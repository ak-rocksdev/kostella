import type { Metadata } from 'next'
import { Shell } from '@/components/management/Shell'

export const metadata: Metadata = {
  title: 'Kostella Pengelola',
  description: 'Panel pengelola — gedung, kamar, dan catatan perubahan.',
  // Internal, and a prototype. Nothing here should reach a search index.
  robots: { index: false, follow: false },
}

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>
}
