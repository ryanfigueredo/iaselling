'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import BentoGrid from '@/components/BentoGrid'
import SecurityStrip from '@/components/SecurityStrip'
import Pricing from '@/components/Pricing'
import Features from '@/components/Features'
import ContactButton from '@/components/ContactButton'

export default function Home() {
  const [hasPaid, setHasPaid] = useState(false)

  useEffect(() => {
    const paymentStatus = localStorage.getItem('payment_approved')
    if (paymentStatus === 'true') setHasPaid(true)
  }, [])

  const handlePaymentSuccess = () => {
    setHasPaid(true)
    localStorage.setItem('payment_approved', 'true')
  }

  return (
    <main className="min-h-screen bg-dark-bg text-white">
      <Header />
      <div className="relative">
        <Hero />
        <Features />
        <BentoGrid />
        <SecurityStrip />
        <Pricing onPaymentSuccess={handlePaymentSuccess} />
      </div>
      {hasPaid && <ContactButton />}
    </main>
  )
}
