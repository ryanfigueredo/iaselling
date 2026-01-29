'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Check, Sparkles } from 'lucide-react'
import CheckoutModal from './CheckoutModal'

// Preço de venda (ajuste aqui quando necessário)
const SELLING_PRICE = 150.0

interface PricingProps {
  onPaymentSuccess: () => void
}

export default function Pricing({ onPaymentSuccess }: PricingProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handlePurchase = () => {
    setIsCheckoutOpen(true)
  }

  const handlePaymentSuccess = () => {
    onPaymentSuccess()
    setIsCheckoutOpen(false)
  }

  const notes = [
    'Todos os sites do Plano BETA são testados e monitorados constantemente.',
    'Alguns serviços podem ser ajustados ou removidos conforme limitações.',
    'Adobe Stock e Shutterstock sob observação; arquivos podem ser solicitados via solicitação direta.',
    'A assinatura não inclui licenças estendidas ou aprimoradas.',
  ]

  return (
    <section id="pricing" className="py-24 px-4 relative">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 md:p-12 neon-border-strong border border-white/[0.08] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
              <span className="text-sm font-medium text-neon-green uppercase tracking-wider">Plano Beta</span>
            </div>
            <h2 className="heading-display text-4xl md:text-5xl text-center mb-2 text-white">
              Acesso IA
            </h2>
            <p className="text-center text-gray-400 mb-8">Acesso completo às ferramentas</p>
            
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-display font-bold text-neon-green">R$ {SELLING_PRICE.toFixed(0)}</span>
                <span className="text-2xl text-gray-500">,00</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Pagamento único</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchase}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-lg hover:bg-neon-green-dark transition-colors shadow-neon"
            >
              <CreditCard className="w-5 h-5" strokeWidth={2} />
              Comprar Agora
            </motion.button>

            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <h3 className="font-display font-semibold text-lg text-neon-green mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" strokeWidth={2} />
                Observações
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                {notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-neon-green mt-1.5 shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amount={SELLING_PRICE}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  )
}
