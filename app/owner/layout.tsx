import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'Kostella Pemilik',
  // Nothing here should be indexed or shared: it is somebody's building's
  // figures, behind no login in this prototype.
  robots: { index: false, follow: false },
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
