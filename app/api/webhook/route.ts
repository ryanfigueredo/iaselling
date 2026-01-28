import { NextRequest, NextResponse } from 'next/server'
import { getMercadoPagoClient } from '@/lib/mercadopago'
import { Payment } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Mercado Pago envia notificações de diferentes tipos
    if (type === 'payment') {
      const paymentId = data.id

      // Buscar informações do pagamento
      const client = getMercadoPagoClient()
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      // Verificar se o pagamento foi aprovado
      if (paymentData.status === 'approved') {
        // Aqui você pode:
        // 1. Salvar no banco de dados
        // 2. Enviar email de confirmação
        // 3. Ativar acesso do usuário
        // 4. Registrar o pagamento

        console.log('Pagamento aprovado:', {
          id: paymentData.id,
          status: paymentData.status,
          amount: paymentData.transaction_amount,
          email: paymentData.payer?.email,
        })

        // TODO: Implementar lógica de ativação de acesso
        // Por exemplo, salvar no banco de dados ou enviar para um serviço externo
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

// GET para verificação do webhook (Mercado Pago pode fazer GET)
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
