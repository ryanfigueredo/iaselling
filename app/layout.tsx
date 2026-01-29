import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Acesso IA - Acesso Premium a Ferramentas Criativas',
  description: 'Acesso exclusivo a mais de 30 plataformas premium de design, IA e criação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
