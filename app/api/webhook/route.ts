import { NextRequest, NextResponse } from 'next/server'
import { getMercadoPagoClient } from '@/lib/mercadopago'
import { Payment } from 'mercadopago'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'payment') {
      const paymentId = data.id

      const client = getMercadoPagoClient()
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      if (paymentData.status === 'approved') {
        const payer = paymentData.payer as any
        const email = payer?.email
        const firstName = payer?.first_name || ''
        const lastName = payer?.last_name || ''
        const document = payer?.identification?.number || null

        if (email) {
          try {
            await prisma.purchase.upsert({
              where: { paymentId: String(paymentId) },
              create: {
                email: email.toLowerCase().trim(),
                name: `${firstName} ${lastName}`.trim() || 'Cliente',
                document,
                paymentId: String(paymentId),
                amount: paymentData.transaction_amount || 0,
                type: 'one_time',
                status: 'approved',
              },
              update: {},
            })
          } catch (dbError) {
            console.error('Erro ao salvar compra no DB:', dbError)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
