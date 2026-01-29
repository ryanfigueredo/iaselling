'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react'

const ADMIN_EMAILS = ['ryan@dmtn.com.br', 'arthur@dmtn.com.br']

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [purchases, setPurchases] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      fetch('/api/admin/purchases')
        .then((r) => r.json())
        .then((d) => {
          if (d.purchases) {
            setPurchases(d.purchases)
            setTotal(d.total || 0)
          }
        })
        .catch(console.error)
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-white mb-4">Acesso negado</h1>
          <p className="text-gray-400 mb-6">Apenas administradores podem acessar.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-green text-dark-bg font-semibold hover:bg-neon-green-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display font-bold text-2xl text-white">Admin</h1>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-2 text-neon-green mb-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Compras</span>
            </div>
            <p className="text-3xl font-bold text-white">{purchases.length}</p>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-2 text-neon-green mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-3xl font-bold text-white">R$ {total.toFixed(2)}</p>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-2 text-neon-green mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Ticket médio</span>
            </div>
            <p className="text-3xl font-bold text-white">
              R$ {purchases.length ? (total / purchases.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-xl text-white mb-4">Todas as compras</h2>
        <div className="space-y-3">
          {purchases.map((p) => (
            <div
              key={p.id}
              className="glass rounded-xl p-4 neon-border flex flex-wrap justify-between items-center gap-4"
            >
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-sm text-gray-400">{p.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-neon-green">R$ {Number(p.amount).toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
