'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface ContactButtonProps {
  onWhatsAppClick?: () => void
}

export default function ContactButton({ onWhatsAppClick }: ContactButtonProps) {
  const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/5511999999999'

  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onWhatsAppClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5A] transition-colors animate-float"
      aria-label="WhatsApp - Suporte e Liberação"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />
    </motion.a>
  )
}
