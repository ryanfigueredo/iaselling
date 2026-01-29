'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, ShieldCheck } from 'lucide-react'

export default function SecurityStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-6 md:p-8 border border-neon-green/20 neon-border overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
                <Shield className="w-6 h-6 text-neon-green" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-display font-semibold text-white">Dados protegidos</p>
                <p className="text-xs text-gray-400">Criptografia SSL</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-neon-green/30" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
                <Lock className="w-6 h-6 text-neon-green" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-display font-semibold text-white">Pagamento seguro</p>
                <p className="text-xs text-gray-400">Mercado Pago</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-neon-green/30" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-neon-green" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-display font-semibold text-white">Seus dados estão seguros</p>
                <p className="text-xs text-gray-400">Não armazenamos dados do cartão</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
