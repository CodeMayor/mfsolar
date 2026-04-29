'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400">Please wait while we take you to the store.</p>
      </div>
    </div>
  )
}
