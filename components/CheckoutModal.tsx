'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, QrCode, Copy, CheckCircle2, CreditCard, ArrowLeft } from 'lucide-react'
import SecurityBadge from './SecurityBadge'
import { CardPayment } from '@mercadopago/sdk-react'
import { useSession } from 'next-auth/react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onPaymentSuccess: () => void
}

async function savePurchase(data: {
  email: string
  name: string
  document: string
  paymentId: string
  amount: number
}) {
  await fetch('/api/purchases/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      document: data.document,
      paymentId: data.paymentId,
      amount: data.amount,
      type: 'one_time',
    }),
  })
}

type Step = 'form' | 'payment-choice' | 'pix' | 'card'

export default function CheckoutModal({ isOpen, onClose, amount, onPaymentSuccess }: CheckoutModalProps) {
  const { data: session, status } = useSession()
  const [step, setStep] = useState<Step>('form')
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

  // Preencher formulário com dados do usuário logado quando abrir o modal
  useEffect(() => {
    if (isOpen && status === 'authenticated' && session?.user?.email) {
      fetch('/api/user/checkout-profile')
        .then((r) => r.json())
        .then((data) => {
          if (data.profile) {
            setFormData({
              email: data.profile.email || '',
              firstName: data.profile.firstName || '',
              lastName: data.profile.lastName || '',
              document: data.profile.document || '',
            })
          }
        })
        .catch(console.error)
    }
  }, [isOpen, status, session?.user?.email])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStep('payment-choice')
  }

  const checkPaymentStatus = async (
    paymentId: string,
    payerData: { email: string; firstName: string; lastName: string; document: string },
    paymentAmount: number
  ) => {
    let attempts = 0
    const maxAttempts = 60

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
          savePurchase({
            email: payerData.email,
            name: `${payerData.firstName} ${payerData.lastName}`.trim(),
            document: payerData.document,
            paymentId,
            amount: paymentAmount,
          }).catch(console.error)
          localStorage.setItem('payment_approved', 'true')
          localStorage.setItem('payment_id', paymentId)
          onPaymentSuccess()
          onClose()
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Pagamento não aprovado')
        } else if (attempts >= maxAttempts) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Tempo de espera esgotado.')
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setError('Erro ao verificar pagamento.')
        }
      }
    }

    intervalRef.current = setInterval(checkStatus, 5000)
  }

  const handlePixPayment = async () => {
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
      if (data.error) throw new Error(data.error)

      if (data.point_of_interaction?.transaction_data?.qr_code) {
        setPixData({
          qrCode: data.point_of_interaction.transaction_data.qr_code,
          qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
          paymentId: data.id,
        })
        setStep('pix')
        checkPaymentStatus(data.id, formData, amount)
      } else {
        throw new Error('Erro ao gerar QR Code PIX')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleCardPayment = () => {
    setStep('card')
    setError(null)
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

  const goBack = () => {
    setError(null)
    if (step === 'payment-choice') setStep('form')
    else if (step === 'pix' || step === 'card') setStep('payment-choice')
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
              <div className="flex items-center gap-3">
                {(step === 'payment-choice' || step === 'pix' || step === 'card') && (
                  <button
                    onClick={goBack}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Voltar"
                  >
                    <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                  </button>
                )}
                <h2 className="font-display font-bold text-2xl text-white">Finalizar Compra</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Step 1: Form */}
            {step === 'form' && (
              <motion.form
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sobrenome</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">CPF</label>
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
                <SecurityBadge variant="full" className="my-4" />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-neon-green text-dark-bg font-display font-semibold text-lg hover:bg-neon-green-dark transition-colors"
                >
                  Continuar para pagamento
                </motion.button>
                <p className="text-center text-gray-500 text-xs">ou escolha direto a forma de pagamento:</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setError(null)
                      if (formData.email && formData.firstName && formData.lastName && formData.document.replace(/\D/g, '').length === 11) {
                        setStep('payment-choice')
                        handlePixPayment()
                      } else {
                        setError('Preencha todos os campos antes de continuar')
                      }
                    }}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass border border-white/[0.08] hover:border-neon-green/40 text-neon-green transition-all disabled:opacity-50"
                  >
                    <QrCode className="w-5 h-5" strokeWidth={1.75} />
                    <span className="font-medium text-sm">PIX</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setError(null)
                      if (formData.email && formData.firstName && formData.lastName && formData.document.replace(/\D/g, '').length === 11) {
                        setStep('payment-choice')
                        handleCardPayment()
                      } else {
                        setError('Preencha todos os campos antes de continuar')
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass border border-white/[0.08] hover:border-neon-green/40 text-neon-green transition-all"
                  >
                    <CreditCard className="w-5 h-5" strokeWidth={1.75} />
                    <span className="font-medium text-sm">Cartão</span>
                  </motion.button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <SecurityBadge variant="compact" className="mt-2" />
              </motion.form>
            )}

            {/* Step 2: Escolher forma de pagamento */}
            {step === 'payment-choice' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h3 className="font-display font-semibold text-lg text-white mb-1">Como deseja pagar?</h3>
                  <p className="text-gray-400 text-sm">Escolha PIX ou cartão de crédito</p>
                </div>
                <div className="grid gap-4">
                  <motion.button
                    onClick={handlePixPayment}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl glass border-2 border-white/[0.08] hover:border-neon-green/50 transition-all text-left group bg-gradient-to-r from-neon-green/5 to-transparent"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center group-hover:bg-neon-green/30 group-hover:scale-110 transition-all">
                      <QrCode className="w-7 h-7 text-neon-green" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-lg text-white">PIX</p>
                      <p className="text-sm text-gray-400">Aprovação instantânea • Escaneie o QR Code</p>
                    </div>
                    <span className="text-neon-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-500 text-xs font-medium">ou</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <motion.button
                    onClick={handleCardPayment}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl glass border-2 border-white/[0.08] hover:border-neon-green/50 transition-all text-left group bg-gradient-to-r from-neon-green/5 to-transparent"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center group-hover:bg-neon-green/30 group-hover:scale-110 transition-all">
                      <CreditCard className="w-7 h-7 text-neon-green" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-lg text-white">Cartão de Crédito</p>
                      <p className="text-sm text-gray-400">Visa, Master, Elo, Amex • Parcelamento</p>
                    </div>
                    <span className="text-neon-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {loading && (
                  <div className="flex items-center gap-2 text-neon-green">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gerando QR Code...</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3a: PIX */}
            {step === 'pix' && pixData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <SecurityBadge variant="compact" />
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-neon-green mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="font-display font-semibold text-xl text-white mb-2">Escaneie o QR Code</h3>
                  <p className="text-gray-400 text-sm">Use o app do seu banco para escanear e pagar</p>
                </div>
                <div className="flex justify-center">
                  <div className="glass rounded-xl p-4 border border-white/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code PIX"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Código PIX (Copiar e Colar)</label>
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
                      {copied ? <CheckCircle2 className="w-5 h-5" strokeWidth={2} /> : <Copy className="w-5 h-5" strokeWidth={2} />}
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
                  <span>Aguardando confirmação...</span>
                </div>
                <motion.button onClick={handleClose} className="w-full py-3 px-6 rounded-xl glass border border-white/[0.06] text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                  Fechar
                </motion.button>
              </motion.div>
            )}

            {/* Step 3b: Cartão */}
            {step === 'card' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <SecurityBadge variant="compact" />
                <CardPaymentForm
                  amount={amount}
                  formData={formData}
                  onSuccess={(paymentId) => {
                    savePurchase({
                      email: formData.email,
                      name: `${formData.firstName} ${formData.lastName}`.trim(),
                      document: formData.document,
                      paymentId: paymentId || 'card-payment',
                      amount,
                    }).catch(console.error)
                    localStorage.setItem('payment_approved', 'true')
                    localStorage.setItem('payment_id', paymentId || '')
                    onPaymentSuccess()
                    onClose()
                  }}
                  onError={setError}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function CardPaymentForm({
  amount,
  formData,
  onSuccess,
  onError,
}: {
  amount: number
  formData: { email: string; firstName: string; lastName: string; document: string }
  onSuccess: (paymentId?: string) => void
  onError: (msg: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [cardType, setCardType] = useState<'credit' | 'debit' | null>(null)
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

  if (!publicKey) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p>Chave pública do Mercado Pago não configurada.</p>
        <p className="text-sm mt-2">Adicione NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no .env</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 p-3 rounded-xl glass border border-white/[0.06]">
        <button
          type="button"
          onClick={() => setCardType('credit')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            cardType === 'credit'
              ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
              : 'bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/15'
          }`}
        >
          <CreditCard className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-sm font-medium">Crédito (até 3x)</span>
        </button>
        <button
          type="button"
          onClick={() => setCardType('debit')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            cardType === 'debit'
              ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
              : 'bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/15'
          }`}
        >
          <CreditCard className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-sm font-medium">Débito (à vista)</span>
        </button>
      </div>

      {cardType && (
        <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
          <CreditCard className="w-4 h-4 text-neon-green" strokeWidth={1.75} />
          <span className="text-sm font-medium text-white">
            Pagando com: <span className="text-neon-green">{cardType === 'credit' ? 'Cartão de crédito (até 3x)' : 'Cartão de débito (à vista)'}</span>
          </span>
        </div>
      )}
      <p className="text-gray-400 text-xs">Crédito: parcelas em até 3x. Débito: à vista. As opções aparecem após digitar o número do cartão.</p>
      <div className="min-h-[300px] rounded-2xl overflow-hidden [&_#cardPaymentBrick_container]:rounded-2xl">
        <CardPayment
        id="cardPaymentBrick_container"
        initialization={{
          amount,
          payer: {
            email: formData.email,
            identification: {
              type: 'CPF',
              number: formData.document.replace(/\D/g, ''),
            },
          },
        }}
        customization={{
          ...({ hideFormTitle: true } as object),
          paymentMethods: {
            minInstallments: 1,
            maxInstallments: 3,
          },
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                formBackgroundColor: '#0a0a0a',
                inputBackgroundColor: 'rgba(255,255,255,0.05)',
                textPrimaryColor: '#ffffff',
                textSecondaryColor: '#9ca3af',
                baseColor: '#00ff88',
                baseColorFirstVariant: '#00cc6a',
                baseColorSecondVariant: '#00cc6a',
                errorColor: '#ef4444',
                successColor: '#00ff88',
                outlinePrimaryColor: 'rgba(0,255,136,0.5)',
                outlineSecondaryColor: 'rgba(0,255,136,0.3)',
                buttonTextColor: '#050505',
                borderRadiusMedium: '12px',
                borderRadiusLarge: '16px',
                inputFocusedBoxShadow: '0 0 0 2px rgba(0,255,136,0.5)',
                inputBorderWidth: '1px',
                inputFocusedBorderWidth: '2px',
              },
            },
          },
        }}
        locale="pt-BR"
        onReady={() => setLoading(false)}
        onError={(err: any) => {
          console.error('Brick error:', err)
          const msg = err?.message || err?.cause?.message || String(err)
          if (msg.includes('payment_method_not_in_allowed_types')) {
            onError('Tipo de cartão não permitido. Tente outro cartão ou forma de pagamento.')
          } else {
            onError(msg || 'Erro ao carregar formulário de pagamento')
          }
        }}
        onSubmit={async (brickFormData: any) => {
          setLoading(true)
          try {
            const payer = brickFormData.payer || {}
            const payerEmail = payer.email || formData.email
            let payerFirstName = payer.first_name || payer.firstName || formData.firstName
            let payerLastName = payer.last_name || payer.lastName || formData.lastName
            if (!payerFirstName && !payerLastName) {
              const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Cliente'
              const parts = fullName.split(/\s+/)
              payerFirstName = parts[0] || 'Cliente'
              payerLastName = parts.slice(1).join(' ') || ''
            }
            payerFirstName = payerFirstName || 'Cliente'
            payerLastName = payerLastName || ''
            const payerDocument = payer.identification?.number || formData.document.replace(/\D/g, '')

            const response = await fetch('/api/create-card-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: brickFormData.token,
                paymentMethodId: brickFormData.payment_method_id || brickFormData.paymentMethodId,
                issuerId: brickFormData.issuer_id || brickFormData.issuerId || '0',
                installments: brickFormData.installments ?? 1,
                amount,
                description: 'Acesso IA Premium',
                payerEmail,
                payerFirstName,
                payerLastName,
                payerDocument,
              }),
            })
            const data = await response.json()
            if (data.error) {
              const errMsg = String(data.error)
              const detail = data.detail || data.mpError?.message || ''
              if (errMsg.includes('payment_method_not_in_allowed_types')) {
                throw new Error('Tipo de cartão não permitido. Verifique se está usando crédito ou débito corretamente.')
              }
              if (errMsg.includes('invalid_token') || errMsg.includes('invalid credentials') || detail.includes('invalid')) {
                throw new Error('Credenciais do Mercado Pago inválidas. Verifique se Public Key e Access Token são da MESMA aplicação e de produção.')
              }
              throw new Error(detail ? `${errMsg} (${detail})` : errMsg)
            }
            if (data.status === 'approved') onSuccess(data.id?.toString?.() || data.id)
            else {
              const detail = data.status_detail || 'Pagamento não aprovado'
              if (detail.includes('cc_rejected_call_for_authorize') || detail.includes('call_for_authorize')) {
                throw new Error('Seu banco exige autorização. Ligue para o banco ou tente com cartão de débito.')
              }
              throw new Error(detail)
            }
          } catch (err: any) {
            const msg = err.message || 'Erro ao processar pagamento'
            if (msg.includes('cc_rejected_call_for_authorize') || msg.includes('call_for_authorize')) {
              onError('Seu banco exige autorização. Ligue para o banco ou tente com cartão de débito.')
            } else if (msg.includes('payment_method_not_in_allowed_types')) {
              onError('Tipo de cartão não permitido. Tente outro cartão ou forma de pagamento.')
            } else {
              onError(msg)
            }
          } finally {
            setLoading(false)
          }
        }}
      />
      {loading && (
        <div className="flex items-center justify-center gap-2 text-neon-green mt-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processando...</span>
        </div>
      )}
    </div>
    </div>
  )
}
