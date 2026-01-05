'use client'

/**
 * Trending Stories Component
 * Displays top trending story clusters on homepage
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTrendingStories } from '@/lib/supabase'

export default function TrendingStories() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getTrendingStories(10)
        setStories(data)
      } catch (err) {
        setError('Erro ao carregar notícias')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <p className="text-gray-600">Nenhuma notícia em destaque no momento.</p>
        <p className="text-sm text-gray-500 mt-2">
          Execute os scrapers para popular o banco de dados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => {
        const coverageCount =
          (story.left_article ? 1 : 0) +
          (story.center_article ? 1 : 0) +
          (story.right_article ? 1 : 0)

        return (
          <Link
            key={story.id}
            href={`/story/${story.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
          >
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {story.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {story.description}
            </p>

            {/* Coverage Indicators */}
            <div className="flex items-center space-x-2 mb-3">
              {story.left_article && (
                <div className="w-8 h-8 rounded-full bg-bias-left flex items-center justify-center text-white text-xs font-bold">
                  E
                </div>
              )}
              {story.center_article && (
                <div className="w-8 h-8 rounded-full bg-bias-center flex items-center justify-center text-white text-xs font-bold">
                  C
                </div>
              )}
              {story.right_article && (
                <div className="w-8 h-8 rounded-full bg-bias-right flex items-center justify-center text-white text-xs font-bold">
                  D
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{coverageCount} perspectiva{coverageCount !== 1 ? 's' : ''}</span>
              <span>
                {new Date(story.last_updated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
