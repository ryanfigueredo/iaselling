import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId } = body

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      )
    }

    const payment = await getPaymentStatus(paymentId)

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
    })
  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}
