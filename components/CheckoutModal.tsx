'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, QrCode, Copy, CheckCircle2 } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentSuccess: () => void
}

export default function CheckoutModal({ isOpen, onClose, amount, onPaymentSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'pix'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    document: '',
  })
  const [pixData, setPixData] = useState<{
    qrCode: string
    qrCodeBase64: string
    paymentId: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: 'Acesso IA Premium',
          payerEmail: formData.email,
          payerFirstName: formData.firstName,
          payerLastName: formData.lastName,
          payerDocument: formData.document,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.point_of_interaction?.transaction_data?.qr_code) {
        setPixData({
          qrCode: data.point_of_interaction.transaction_data.qr_code,
          qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
          paymentId: data.id,
        })
        setStep('pix')
        checkPaymentStatus(data.id)
      } else {
        throw new Error('Erro ao gerar QR Code PIX')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 60 // 5 minutos (5s * 60)
    let attempts = 0

    const checkStatus = async () => {
      attempts++
      
      try {
        const response = await fetch('/api/check-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        })

        const data = await response.json()

        if (data.status === 'approved') {
          if (intervalRef.current) clearInterval(intervalRef.current)
          localStorage.setItem('payment_approved', 'true')
          localStorage.setItem('payment_id', paymentId)
          onPaymentSuccess()
          onClose()
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Pagamento não aprovado')
        } else if (attempts >= maxAttempts) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Tempo de espera esgotado. Verifique o pagamento manualmente.')
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err)
        if (attempts >= maxAttempts) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Erro ao verificar pagamento. Verifique manualmente.')
        }
      }
    }

    intervalRef.current = setInterval(checkStatus, 5000) // Verifica a cada 5 segundos
  }

  const copyToClipboard = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setStep('form')
    setError(null)
    setPixData(null)
    setFormData({ email: '', firstName: '', lastName: '', document: '' })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-strong rounded-3xl p-6 md:p-8 max-w-md w-full neon-border-strong border border-white/[0.08] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Finalizar Compra</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
                      placeholder="Nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
                      placeholder="Sobrenome"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.document}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const formatted = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      setFormData({ ...formData, document: formatted })
                    }}
                    maxLength={14}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 transition-colors"
                    placeholder="000.000.000-00"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-lg hover:bg-neon-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" strokeWidth={2} />
                      Gerar QR Code PIX
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {step === 'pix' && pixData && (
              <div className="space-y-6">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-neon-green mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-display font-semibold text-xl text-white mb-2">
                    Escaneie o QR Code
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Use o app do seu banco para escanear e pagar
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="glass rounded-xl p-4 border border-white/[0.06]">
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code PIX"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código PIX (Copiar e Colar)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.qrCode}
                      className="flex-1 px-4 py-3 rounded-xl glass border border-white/[0.06] bg-white/5 text-white text-xs font-mono focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="px-4 py-3 rounded-xl bg-neon-green/20 border border-neon-green/30 text-neon-green hover:bg-neon-green/30 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                      ) : (
                        <Copy className="w-5 h-5" strokeWidth={2} />
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                  <span>Aguardando confirmação do pagamento...</span>
                </div>

                <motion.button
                  onClick={handleClose}
                  className="w-full py-3 px-6 rounded-xl glass border border-white/[0.06] text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                >
                  Fechar
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
