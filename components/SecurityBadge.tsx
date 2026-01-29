'use client'

import { Shield, Lock } from 'lucide-react'

interface SecurityBadgeProps {
  variant?: 'compact' | 'full'
  className?: string
}

export default function SecurityBadge({ variant = 'compact', className = '' }: SecurityBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neon-green/5 border border-neon-green/20 ${className}`}>
        <Shield className="w-4 h-4 text-neon-green shrink-0" strokeWidth={1.75} />
        <span className="text-xs text-gray-400">
          <span className="text-neon-green font-medium">Pagamento seguro</span>
          {' • '}
          Dados criptografados
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl glass border border-neon-green/20 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shrink-0">
        <Lock className="w-5 h-5 text-neon-green" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm font-medium text-white">Seus dados estão protegidos</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Pagamento processado pelo Mercado Pago com criptografia SSL. Não armazenamos dados do cartão.
        </p>
      </div>
    </div>
  )
}
