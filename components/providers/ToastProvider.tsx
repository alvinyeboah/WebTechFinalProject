'use client'
import { useEffect, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  const searchParams = useSearchParams()
  const [authToastShown, setAuthToastShown] = useState(false) // Add local state

  useEffect(() => {
    const showAuthToast = searchParams.get('showAuthToast')

    if (showAuthToast === 'true' && !authToastShown) { // Check local state
      toast.error('Please sign in to access this page', {
        id: 'auth-toast',
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#F44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      })
      setAuthToastShown(true) // Update local state
    }
  }, [searchParams, authToastShown]) // Add authToastShown to dependencies
  
  return <Toaster />
}
export default function ToastProviderWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastProvider />
    </Suspense>
  )
}