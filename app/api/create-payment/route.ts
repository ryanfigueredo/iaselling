import { NextRequest, NextResponse } from 'next/server'
import { createPaymentPreference } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, price } = body

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Título e preço são obrigatórios' },
        { status: 400 }
      )
    }

    const preference = await createPaymentPreference(title, price)

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
}
