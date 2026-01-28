'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'

export default function PaymentPending() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(234,179,8,0.08),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass-strong rounded-3xl p-8 md:p-12 max-w-xl w-full text-center neon-border-strong border border-white/[0.08]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-6"
        >
          <Clock className="w-10 h-10 text-amber-400" strokeWidth={1.75} />
        </motion.div>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-4 text-amber-400">
          Pagamento Pendente
        </h1>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Seu pagamento está sendo processado. Você receberá uma notificação assim que for aprovado.
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neon-green text-dark-bg font-display font-semibold rounded-xl hover:bg-neon-green-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            Voltar para o Início
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
