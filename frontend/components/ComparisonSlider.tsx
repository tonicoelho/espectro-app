'use client'

/**
 * Comparison Slider Component
 * Shows Left/Center/Right perspectives on the same story
 * Uses framer-motion for smooth swipes on mobile
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  snippet: string
  url: string
  polarization_score: number
  source: {
    name: string
    logo_url?: string
    economic_score: number
    social_score: number
    institutional_score: number
  }
}

interface ComparisonSliderProps {
  clusterId: string
  clusterTitle: string
  leftArticle?: Article
  centerArticle?: Article
  rightArticle?: Article
  dataLiteMode?: boolean
}

const BiasLabel = ({ type }: { type: 'left' | 'center' | 'right' }) => {
  const labels = {
    left: { text: 'Esquerda', color: 'bg-bias-left' },
    center: { text: 'Centro', color: 'bg-bias-center' },
    right: { text: 'Direita', color: 'bg-bias-right' },
  }

  const { text, color } = labels[type]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color} text-white`}>
      {text}
    </span>
  )
}

const ZAxisBadge = ({ score }: { score: number }) => {
  // Z-Axis: Institutional score
  // +5 = Pro-Establishment (Green), -5 = Anti-System (Orange)
  const isProEstablishment = score >= 3
  const label = isProEstablishment ? 'Institucionalista' : 'Anti-Sistema'
  const color = isProEstablishment ? 'bg-z-axis-pro' : 'bg-z-axis-anti'

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color} text-white`}>
      {label}
    </span>
  )
}

const ArticleCard = ({
  article,
  bias,
  dataLiteMode
}: {
  article: Article,
  bias: 'left' | 'center' | 'right',
  dataLiteMode: boolean
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <BiasLabel type={bias} />
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">{article.source.name}</p>
            <ZAxisBadge score={article.source.institutional_score} />
          </div>
        </div>

        {/* Source Logo or Bias Color Block (Data-Lite) */}
        {dataLiteMode ? (
          <div
            className={`w-16 h-16 rounded-lg border-4 ${
              bias === 'left' ? 'border-bias-left' :
              bias === 'center' ? 'border-bias-center' :
              'border-bias-right'
            }`}
          />
        ) : (
          article.source.logo_url && (
            <img
              src={article.source.logo_url}
              alt={article.source.name}
              className="w-16 h-16 object-contain"
            />
          )
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-3">
        {article.title}
      </h3>

      {/* Snippet */}
      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-4">
        {article.snippet}
      </p>

      {/* Polarization Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Polarização</span>
          <span className="font-semibold">{article.polarization_score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              article.polarization_score < 30 ? 'bg-green-500' :
              article.polarization_score < 70 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${article.polarization_score}%` }}
          />
        </div>
      </div>

      {/* Read Full Article */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
      >
        Ler matéria completa →
      </a>
    </div>
  )
}

export default function ComparisonSlider({
  clusterId,
  clusterTitle,
  leftArticle,
  centerArticle,
  rightArticle,
  dataLiteMode = false,
}: ComparisonSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(1) // Start with center

  const articles = [
    { article: leftArticle, bias: 'left' as const },
    { article: centerArticle, bias: 'center' as const },
    { article: rightArticle, bias: 'right' as const },
  ].filter(({ article }) => article !== undefined)

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600">Nenhum artigo disponível para esta notícia ainda.</p>
      </div>
    )
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Cluster Title */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-900">{clusterTitle}</h2>
        <p className="text-sm text-gray-600 mt-1">
          Compare como diferentes fontes cobrem esta notícia
        </p>
      </div>

      {/* Desktop: Side-by-side grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {leftArticle && <ArticleCard article={leftArticle} bias="left" dataLiteMode={dataLiteMode} />}
        {centerArticle && <ArticleCard article={centerArticle} bias="center" dataLiteMode={dataLiteMode} />}
        {rightArticle && <ArticleCard article={rightArticle} bias="right" dataLiteMode={dataLiteMode} />}
      </div>

      {/* Mobile: Swipeable slider */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          {articles[currentIndex] && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) handleSwipe('left')
                if (info.offset.x > 50) handleSwipe('right')
              }}
            >
              <ArticleCard
                article={articles[currentIndex].article!}
                bias={articles[currentIndex].bias}
                dataLiteMode={dataLiteMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe Indicators */}
        <div className="flex justify-center items-center space-x-2 mt-4">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleSwipe('right')}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <button
            onClick={() => handleSwipe('left')}
            disabled={currentIndex === articles.length - 1}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>

      {/* Share Link */}
      <div className="text-center text-sm text-gray-600">
        <span>Compartilhe esta comparação: </span>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          espectro.app/story/{clusterId}
        </code>
      </div>
    </div>
  )
}
