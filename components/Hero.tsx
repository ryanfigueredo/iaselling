'use client'

import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.15),transparent)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-green rounded-full blur-[120px] opacity-20 animate-pulse-neon" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-green rounded-full blur-[100px] opacity-15 animate-pulse-neon" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-green/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-neon-green" />
          <span className="text-sm font-medium text-gray-300">Plano Beta • Acesso Imediato</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.05]"
        >
          <span className="gradient-text">Acesso</span>
          <br />
          <span className="text-white">Premium</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Navegação anônima, segura e controlada para mais de 30 plataformas premium
          sem precisar de login e senha
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-5 h-5 text-neon-green/80" />
            <span className="text-sm font-medium">Anônimo & Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-5 h-5 text-neon-green/80" />
            <span className="text-sm font-medium">Sem Login</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto neon-border text-left"
        >
          <p className="text-gray-300 leading-relaxed">
            Acesso direto e seguro a plataformas online através de nossa infraestrutura, 
            oferecendo navegação anônima e controlada — sem precisar colocar login e senha nos sites.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
