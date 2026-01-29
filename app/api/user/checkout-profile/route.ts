import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Retorna os dados do usuário logado para preencher o checkout.
 * Usa email da sessão e name/document da última compra.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ profile: null })
    }

    const email = session.user.email.toLowerCase()

    // Buscar última compra do usuário para pegar nome e CPF
    const lastPurchase = await prisma.purchase.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: { name: true, document: true },
    })

    let firstName = ''
    let lastName = ''
    let document = ''

    if (lastPurchase?.name) {
      const parts = lastPurchase.name.trim().split(/\s+/)
      firstName = parts[0] || ''
      lastName = parts.slice(1).join(' ') || ''
    }
    if (lastPurchase?.document) {
      const digits = lastPurchase.document.replace(/\D/g, '')
      if (digits.length === 11) {
        document = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      } else {
        document = lastPurchase.document
      }
    }

    return NextResponse.json({
      profile: {
        email,
        firstName,
        lastName,
        document,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar perfil de checkout:', error)
    return NextResponse.json({ profile: null })
  }
}
