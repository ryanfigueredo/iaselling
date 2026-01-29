'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { initMercadoPago } from '@mercadopago/sdk-react'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (publicKey) {
      initMercadoPago(publicKey)
    }
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
