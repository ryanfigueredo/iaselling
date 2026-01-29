'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ArrowLeft, MessageCircle } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')

  useEffect(() => {
    if (status === 'approved' && paymentId) {
      localStorage.setItem('payment_approved', 'true')
      localStorage.setItem('payment_id', paymentId)
    }
  }, [status, paymentId])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.12),transparent)]" />
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
          className="w-20 h-20 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-neon-green" strokeWidth={1.75} />
        </motion.div>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-4 text-neon-green">
          Pagamento Aprovado!
        </h1>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Seu pagamento foi processado com sucesso. Você tem acesso completo ao Acesso IA Premium.
        </p>
        {paymentId && (
          <p className="text-sm text-gray-500 mb-8 font-mono">ID: {paymentId}</p>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neon-green text-dark-bg font-display font-semibold rounded-xl hover:bg-neon-green-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            Voltar para o Início
          </Link>
        </motion.div>
        <p className="text-sm text-gray-400 mt-6 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 text-neon-green/80" />
          Use o botão de suporte no canto inferior direito para receber seus acessos.
        </p>
      </motion.div>
    </div>
  )
}

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<Fallback />}>
      <SuccessContent />
    </Suspense>
  )
}
