import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = ['ryan@dmtn.com.br', 'arthur@dmtn.com.br']

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const isAdmin = ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const purchases = await prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const total = purchases.reduce((sum, p) => sum + Number(p.amount), 0)

    return NextResponse.json({
      purchases,
      total,
      count: purchases.length,
    })
  } catch (error: any) {
    console.error('Erro ao buscar compras admin:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar compras' },
      { status: 500 }
    )
  }
}
