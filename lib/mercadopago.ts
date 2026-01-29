import { MercadoPagoConfig, Payment } from 'mercadopago'

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

export async function createPixPayment(
  amount: number,
  description: string,
  payerEmail: string,
  payerFirstName: string,
  payerLastName: string,
  payerDocument: string
) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)

  const paymentData = {
    transaction_amount: amount,
    description: description,
    payment_method_id: 'pix',
    payer: {
      email: payerEmail,
      first_name: payerFirstName,
      last_name: payerLastName,
      identification: {
        type: 'CPF',
        number: payerDocument.replace(/\D/g, ''),
      },
    },
  }

  const response = await payment.create({ body: paymentData })
  return response
}

export async function getPaymentStatus(paymentId: string) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)
  
  const paymentData = await payment.get({ id: paymentId })
  return paymentData
}

export async function createCardPayment(params: {
  token: string
  paymentMethodId: string
  issuerId: string
  amount: number
  description: string
  payerEmail: string
  payerFirstName: string
  payerLastName: string
  payerDocument: string
  installments?: number
}) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)

  const paymentData: Record<string, unknown> = {
    token: params.token,
    transaction_amount: params.amount,
    description: params.description,
    installments: params.installments ?? 1,
    payment_method_id: params.paymentMethodId,
    payer: {
      email: params.payerEmail,
      first_name: params.payerFirstName,
      last_name: params.payerLastName,
      identification: {
        type: 'CPF',
        number: params.payerDocument.replace(/\D/g, ''),
      },
    },
  }
  if (params.issuerId) {
    paymentData.issuer_id = Number(params.issuerId)
  }

  const response = await payment.create({
    body: paymentData,
    requestOptions: {
      idempotencyKey: crypto.randomUUID(),
    },
  })
  return response
}
