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
    } = body

    if (!token || !paymentMethodId || !amount || !payerEmail || !payerFirstName || !payerLastName || !payerDocument) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

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
      payerFirstName,
      payerLastName,
      payerDocument: cleanDocument,
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
