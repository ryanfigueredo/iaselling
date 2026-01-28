import { MercadoPagoConfig, Preference } from 'mercadopago'

// Inicializar cliente do Mercado Pago
export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado')
  }

  const client = new MercadoPagoConfig({
    accessToken: accessToken,
    options: {
      timeout: 5000,
      idempotencyKey: 'abc',
    },
  })

  return client
}

export async function createPaymentPreference(
  title: string,
  price: number,
  email?: string
) {
  const client = getMercadoPagoClient()
  const preference = new Preference(client)

  const paymentData = {
    items: [
      {
        id: 'govip-beta',
        title: title,
        quantity: 1,
        unit_price: price,
        currency_id: 'BRL',
      },
    ],
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`,
      pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/pending`,
    },
    auto_return: 'approved' as const,
    notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook`,
    payer: email ? { email } : undefined,
  }

  const response = await preference.create({ body: paymentData })
  return response
}
