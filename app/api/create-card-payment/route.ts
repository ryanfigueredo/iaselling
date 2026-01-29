import { NextRequest, NextResponse } from 'next/server'
import { createCardPayment } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      token,
      paymentMethodId,
      issuerId,
      amount,
      description,
      payerEmail,
      payerFirstName,
      payerLastName,
      payerDocument,
      installments,
    } = body

    const missing: string[] = []
    if (!token) missing.push('token do cartão')
    if (!paymentMethodId) missing.push('tipo do cartão')
    if (!amount) missing.push('valor')
    if (!payerEmail) missing.push('email')
    if (!payerFirstName) missing.push('nome')
    if (!payerDocument) missing.push('CPF')

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    const firstName = String(payerFirstName).trim() || 'Cliente'
    const lastName = String(payerLastName || '').trim()

    const cleanDocument = String(payerDocument).replace(/\D/g, '')
    if (cleanDocument.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      )
    }

    const payment = await createCardPayment({
      token,
      paymentMethodId,
      issuerId: issuerId || '0',
      amount: Number(amount),
      description: description || 'Acesso IA Premium',
      payerEmail,
      payerFirstName: firstName,
      payerLastName: lastName || firstName,
      payerDocument: cleanDocument,
      installments: installments ? Number(installments) : 1,
    })

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    })
  } catch (error: any) {
    console.error('Erro ao criar pagamento com cartão:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
