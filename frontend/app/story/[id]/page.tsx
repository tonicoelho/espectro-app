/**
 * Story Cluster Detail Page
 * Server-Side Rendered for SEO and social sharing
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import ComparisonSlider from '@/components/ComparisonSlider'
import { getStoryCluster } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // Disable static generation

interface PageProps {
  params: {
    id: string
  }
}

export default async function StoryPage({ params }: PageProps) {
  const story = await getStoryCluster(params.id)

  if (!story) {
    notFound()
  }

  // Check for Data-Lite mode from environment
  const dataLiteMode = process.env.NEXT_PUBLIC_DATA_LITE === 'true'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Voltar para home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            🇧🇷 Espectro
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComparisonSlider
          clusterId={story.id}
          clusterTitle={story.title}
          leftArticle={story.left_article}
          centerArticle={story.center_article}
          rightArticle={story.right_article}
          dataLiteMode={dataLiteMode}
        />

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Como funciona o Espectro?
          </h3>
          <div className="prose prose-sm text-gray-600">
            <p>
              O Espectro agrupa notícias sobre o mesmo evento e mostra como diferentes
              fontes (Esquerda, Centro, Direita) cobrem a história.
            </p>
            <ul>
              <li>
                <strong>Polarização (0-100):</strong> Mede o quão carregada emocionalmente
                está a linguagem.
              </li>
              <li>
                <strong>Z-Axis (Institucionalismo):</strong> O divisor chave para 2026 é
                "Pró-STF" vs "Anti-Sistema".
              </li>
              <li>
                <strong>Modo Data-Lite:</strong> Sem imagens para economizar dados (45% dos
                brasileiros usam pré-pago!).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const story = await getStoryCluster(params.id)

  if (!story) {
    return {
      title: 'Notícia não encontrada | Espectro',
    }
  }

  return {
    title: `${story.title} | Espectro`,
    description: story.description,
    openGraph: {
      title: story.title,
      description: story.description,
      type: 'article',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.description,
    },
  }
}
