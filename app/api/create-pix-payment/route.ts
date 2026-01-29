import { NextRequest, NextResponse } from 'next/server'
import { createPixPayment } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, payerEmail, payerFirstName, payerLastName, payerDocument } = body

    if (!amount || !description || !payerEmail || !payerFirstName || !payerLastName || !payerDocument) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar CPF básico
    const cleanDocument = payerDocument.replace(/\D/g, '')
    if (cleanDocument.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      )
    }

    const payment = await createPixPayment(
      amount,
      description,
      payerEmail,
      payerFirstName,
      payerLastName,
      payerDocument
    )

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      point_of_interaction: payment.point_of_interaction,
    })
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
