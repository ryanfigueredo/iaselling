'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, X, ExternalLink } from 'lucide-react'

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const DISCORD_LINK = process.env.NEXT_PUBLIC_DISCORD_LINK || 'https://discord.gg/seu-servidor'
  const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/5511999999999'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
      >
        {!isOpen ? (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neon-green flex items-center justify-center text-dark-bg shadow-neon hover:shadow-neon-lg transition-shadow animate-float"
            aria-label="Abrir contato"
          >
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass-strong rounded-2xl p-6 neon-border-strong min-w-[260px] border border-white/[0.08]"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-semibold text-lg text-neon-green flex items-center gap-2">
                <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                Suporte & Liberação
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-3">
              <motion.a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#5865F2] text-white font-medium hover:bg-[#4752C4] transition-colors"
              >
                Discord
                <ExternalLink className="w-4 h-4 opacity-80" strokeWidth={2} />
              </motion.a>
              <motion.a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20BA5A] transition-colors"
              >
                WhatsApp
                <ExternalLink className="w-4 h-4 opacity-80" strokeWidth={2} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
