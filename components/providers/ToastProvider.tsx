'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const showAuthToast = searchParams.get('showAuthToast')

    if (showAuthToast === 'true') {
      toast.error('Please sign in to access this page', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#F44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      })
    }
  }, [searchParams])
  return <Toaster />
}

export default function ToastProviderWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastProvider />
    </Suspense>
  )
}
