'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const scrollToPricing = () => {
    const el = document.getElementById('pricing')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
      <div className="max-w-6xl mx-auto flex justify-end items-center gap-3">
        <Link
          href="/conta"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/[0.06] text-gray-300 hover:text-white hover:border-neon-green/30 transition-colors text-sm font-medium cursor-pointer"
        >
          <User className="w-4 h-4" strokeWidth={2} />
          Minha Conta
        </Link>
        {isHome ? (
          <motion.button
            onClick={scrollToPricing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-sm hover:bg-neon-green-dark transition-colors shadow-neon"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
            Comprar
          </motion.button>
        ) : (
          <Link
            href="/#pricing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-sm hover:bg-neon-green-dark transition-colors shadow-neon"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
            Comprar
          </Link>
        )}
      </div>
    </header>
  )
}
