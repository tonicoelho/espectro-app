import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Espectro - Veja a notícia de todos os lados',
  description: 'Rastreador de viés político na mídia brasileira. Compare como diferentes fontes cobrem a mesma notícia.',
  keywords: ['brasil', 'política', 'notícias', 'viés', 'mídia', 'eleições 2026'],
  authors: [{ name: 'Espectro Team' }],
  openGraph: {
    title: 'Espectro - Veja a notícia de todos os lados',
    description: 'Compare como esquerda, centro e direita cobrem a mesma notícia',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Espectro - Veja a notícia de todos os lados',
    description: 'Rastreador de viés político na mídia brasileira',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
