'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Check, Loader2, Sparkles } from 'lucide-react'

// Preço de venda (ajuste aqui quando necessário)
const SELLING_PRICE = 150.0

interface PricingProps {
  onPaymentSuccess: () => void
}

export default function Pricing({ onPaymentSuccess }: PricingProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'GoVIP Plano Beta', price: SELLING_PRICE }),
      })
      const data = await response.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        throw new Error('Erro ao criar pagamento')
      }
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.')
      setLoading(false)
    }
  }

  const notes = [
    'Todos os sites do Plano BETA são testados e monitorados constantemente.',
    'Alguns serviços podem ser ajustados ou removidos conforme limitações.',
    'Adobe Stock e Shutterstock sob observação; arquivos podem ser solicitados via GoVIP.',
    'A assinatura não inclui licenças estendidas ou aprimoradas.',
  ]

  return (
    <section className="py-24 px-4 relative">
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
              GoVIP
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
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-lg hover:bg-neon-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-neon"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" strokeWidth={2} />
                  Comprar Agora
                </>
              )}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center mt-4"
              >
                {error}
              </motion.p>
            )}

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
    </section>
  )
}
