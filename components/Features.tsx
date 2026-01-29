'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, MessageCircle } from 'lucide-react'

const features = [
  {
    title: 'Navegação Anônima',
    description: 'Acesso seguro sem expor suas credenciais',
    icon: Shield,
  },
  {
    title: 'Acesso Imediato',
    description: 'Comece a usar assim que o pagamento for aprovado',
    icon: Zap,
  },
  {
    title: 'Suporte Dedicado',
    description: 'Atendimento via WhatsApp para membros',
    icon: MessageCircle,
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group glass rounded-2xl p-6 neon-border card-hover border border-white/[0.06] flex flex-col min-h-[220px] overflow-visible"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-4 shrink-0 group-hover:bg-neon-green/15 group-hover:border-neon-green/30 transition-colors">
                <feature.icon className="w-6 h-6 text-neon-green" strokeWidth={1.75} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-white shrink-0">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
