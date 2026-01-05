import Link from 'next/link'
import TrendingStories from '@/components/TrendingStories'

export const dynamic = 'force-dynamic' // Disable static generation for real-time data

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🇧🇷 Espectro
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Veja a notícia de todos os lados
              </p>
            </div>

            <nav className="flex space-x-4">
              <Link
                href="/blindspot"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Blindspot
              </Link>
              <Link
                href="/sources"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Fontes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Compare as mesmas notícias sob diferentes perspectivas
          </h2>
          <p className="text-blue-100 mb-4">
            Veja como Esquerda, Centro e Direita cobrem os mesmos eventos.
            Saia da bolha!
          </p>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bias-left text-white">
              Esquerda
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bias-center text-white">
              Centro
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bias-right text-white">
              Direita
            </span>
          </div>
        </div>

        {/* Trending Stories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📰 Notícias em Destaque
          </h2>
          <TrendingStories />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            Espectro - Rastreador de Viés Político na Mídia Brasileira
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Feito com ❤️ para a democracia brasileira | Eleições 2026
          </p>
        </div>
      </footer>
    </main>
  )
}
