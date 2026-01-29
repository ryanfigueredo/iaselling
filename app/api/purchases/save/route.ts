import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, document, paymentId, amount, type = 'one_time' } = body

    if (!email || !name || !paymentId || amount == null) {
      return NextResponse.json(
        { error: 'Email, nome, paymentId e amount são obrigatórios' },
        { status: 400 }
      )
    }

    await prisma.purchase.upsert({
      where: { paymentId: String(paymentId) },
      create: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        document: document?.replace(/\D/g, '') || null,
        paymentId: String(paymentId),
        amount: Number(amount),
        type,
        status: 'approved',
      },
      update: {},
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao salvar compra:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar compra' },
      { status: 500 }
    )
  }
}
