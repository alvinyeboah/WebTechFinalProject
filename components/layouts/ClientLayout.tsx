"use client"

import { usePathname } from 'next/navigation'
import { SessionProvider } from "@/context/SessionContext"
import ToastProviderWrapper from "@/components/providers/ToastProvider"
import ArtGalleryNav from "@/components/home/ArtGalleryNav"
import Footer from "@/components/home/footer"

export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <SessionProvider>
      {!isAuthPage && <ArtGalleryNav />}
      <main className={`flex-grow ${isAuthPage ? '' : 'pt-16'}`}>{children}</main>
      {!isAuthPage && <Footer />}
      <ToastProviderWrapper />
    </SessionProvider>
  )
} 