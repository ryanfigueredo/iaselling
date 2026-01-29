import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()

    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email já cadastrado. Faça login.' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.create({
      data: {
        email: emailLower,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: 'Conta criada! Use o mesmo email que usou na compra para ver seu histórico.',
    })
  } catch (error: any) {
    console.error('Erro ao criar conta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
