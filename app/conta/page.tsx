'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ShoppingBag, LogOut, ArrowLeft } from 'lucide-react'

export default function ContaPage() {
  const { data: session, status } = useSession()
  const [purchases, setPurchases] = useState<any[]>([])
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/purchases/my')
        .then((r) => r.json())
        .then((d) => setPurchases(d.purchases || []))
        .catch(console.error)
    }
  }, [session])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    try {
      if (authMode === 'login') {
        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (res?.error) throw new Error(res.error)
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        const signInRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (signInRes?.error) throw new Error(signInRes.error)
      }
      const purchasesRes = await fetch('/api/purchases/my')
      const purchasesData = await purchasesRes.json()
      setPurchases(purchasesData.purchases || [])
    } catch (err: any) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-bg px-4 py-20">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="glass rounded-2xl p-8 neon-border">
            <h1 className="font-display font-bold text-2xl mb-2 text-white">
              {authMode === 'login' ? 'Entrar' : 'Criar conta'}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              {authMode === 'signup'
                ? 'Use o mesmo email que usou na compra para ver seu histórico.'
                : 'Entre para ver suas compras.'}
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
              />
              {authError && (
                <p className="text-red-400 text-sm">{authError}</p>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-neon-green text-dark-bg font-semibold hover:bg-neon-green-dark disabled:opacity-50"
              >
                {authLoading ? '...' : authMode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login')
                setAuthError(null)
              }}
              className="w-full mt-4 text-sm text-neon-green hover:underline"
            >
              {authMode === 'login' ? 'Criar conta' : 'Já tenho conta'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display font-bold text-2xl text-white">Minhas Compras</h1>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-6">{session.user?.email}</p>
        {purchases.length === 0 ? (
          <div className="glass rounded-2xl p-8 neon-border text-center">
            <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma compra encontrada.</p>
            <p className="text-gray-500 text-sm mt-2">
              Use o mesmo email que usou na compra para ver seu histórico.
            </p>
            <Link
              href="/#pricing"
              className="inline-block mt-4 px-6 py-2 rounded-xl bg-neon-green text-dark-bg font-semibold hover:bg-neon-green-dark"
            >
              Comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="glass rounded-xl p-4 neon-border flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-gray-400">
                    R$ {Number(p.amount).toFixed(2)} • {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="text-xs text-neon-green font-medium px-2 py-1 rounded bg-neon-green/20">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
