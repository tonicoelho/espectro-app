/**
 * Story Clustering Service
 * Groups articles covering the same event using similarity algorithms
 * Powers the Comparison Slider feature
 */

import { createClient } from '@supabase/supabase-js';

// Levenshtein distance for string similarity
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
function stringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

/**
 * Normalize a headline for better clustering
 * Removes punctuation, common words, etc.
 */
function normalizeHeadline(headline: string): string {
  // Remove punctuation
  let normalized = headline.replace(/[^\w\s]/g, '');

  // Remove common Brazilian Portuguese stop words
  const stopWords = [
    'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem',
    'e', 'ou', 'mas', 'que', 'como', 'quando', 'onde'
  ];

  const words = normalized.toLowerCase().split(/\s+/);
  const filtered = words.filter(word => !stopWords.includes(word) && word.length > 2);

  return filtered.join(' ');
}

/**
 * Extract key entities from headline (people, places, organizations)
 * Simple pattern matching for Brazilian politics
 */
function extractEntities(headline: string): string[] {
  const entities: string[] = [];

  // Politicians
  const politicians = [
    'Bolsonaro', 'Lula', 'Alckmin', 'Moraes', 'Fachin', 'Barroso',
    'Tarcísio', 'Haddad', 'Pacheco', 'Lira'
  ];

  // Institutions
  const institutions = [
    'STF', 'STJ', 'TSE', 'Congresso', 'Senado', 'Câmara',
    'Planalto', 'Supremo', 'Petrobras', 'Banco Central'
  ];

  const allKeywords = [...politicians, ...institutions];

  for (const keyword of allKeywords) {
    if (headline.includes(keyword)) {
      entities.push(keyword.toLowerCase());
    }
  }

  return entities;
}

/**
 * Calculate semantic similarity between two headlines
 * Uses multiple signals: string similarity, entities, keywords
 */
function calculateSemanticSimilarity(
  headline1: string,
  headline2: string
): number {
  // 1. String similarity (40% weight)
  const stringSim = stringSimilarity(
    normalizeHeadline(headline1),
    normalizeHeadline(headline2)
  );

  // 2. Entity overlap (40% weight)
  const entities1 = extractEntities(headline1);
  const entities2 = extractEntities(headline2);

  const entityOverlap = entities1.filter(e => entities2.includes(e)).length;
  const entitySim = entityOverlap / Math.max(entities1.length, entities2.length, 1);

  // 3. Keyword overlap (20% weight)
  const words1 = new Set(normalizeHeadline(headline1).split(' '));
  const words2 = new Set(normalizeHeadline(headline2).split(' '));

  const intersection = [...words1].filter(w => words2.has(w)).length;
  const union = new Set([...words1, ...words2]).size;
  const keywordSim = intersection / union;

  // Weighted average
  const finalScore = (stringSim * 0.4) + (entitySim * 0.4) + (keywordSim * 0.2);

  return finalScore;
}

interface Article {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source_id: string;
  published_at: string;
  polarization_score?: number;
}

interface StoryCluster {
  id: string;
  title: string;
  description: string;
  article_ids: string[];
}

/**
 * Clustering Service
 * Main class for story clustering operations
 */
export class ClusteringService {
  private supabase;
  private similarityThreshold = 0.65; // Articles with >65% similarity belong to same cluster

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials in environment');
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  /**
   * Find existing cluster for a new article
   * Returns cluster_id or null if no match found
   */
  async findClusterForArticle(article: Article): Promise<string | null> {
    try {
      // Get recent articles from the last 48 hours (same-day news cycle)
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

      const { data: recentArticles, error } = await this.supabase
        .from('articles')
        .select('id, title, story_cluster_id')
        .gte('published_at', twoDaysAgo.toISOString())
        .not('story_cluster_id', 'is', null);

      if (error) {
        console.error('Error fetching recent articles:', error);
        return null;
      }

      if (!recentArticles || recentArticles.length === 0) {
        return null;
      }

      // Calculate similarity with each recent article
      let bestMatch: { cluster_id: string; similarity: number } | null = null;

      for (const existingArticle of recentArticles) {
        const similarity = calculateSemanticSimilarity(
          article.title,
          existingArticle.title
        );

        if (
          similarity >= this.similarityThreshold &&
          (!bestMatch || similarity > bestMatch.similarity)
        ) {
          bestMatch = {
            cluster_id: existingArticle.story_cluster_id,
            similarity
          };
        }
      }

      if (bestMatch) {
        console.log(`✓ Found cluster match (similarity: ${(bestMatch.similarity * 100).toFixed(1)}%)`);
        return bestMatch.cluster_id;
      }

      return null;
    } catch (error) {
      console.error('Error in findClusterForArticle:', error);
      return null;
    }
  }

  /**
   * Create a new story cluster
   */
  async createCluster(article: Article): Promise<string | null> {
    try {
      const normalizedTitle = this.generateClusterTitle([article.title]);

      const { data, error } = await this.supabase
        .from('story_clusters')
        .insert({
          title: normalizedTitle,
          description: article.snippet,
          primary_topic: 'politics', // TODO: Implement topic classification
          total_articles: 1,
          is_trending: true
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating cluster:', error);
        return null;
      }

      console.log(`✓ Created new cluster: "${normalizedTitle}"`);
      return data.id;
    } catch (error) {
      console.error('Error in createCluster:', error);
      return null;
    }
  }

  /**
   * Add article to existing cluster
   */
  async addToCluster(clusterId: string, articleId: string): Promise<void> {
    try {
      // Update cluster metadata
      const { error: clusterError } = await this.supabase.rpc(
        'increment_cluster_article_count',
        { cluster_id: clusterId }
      );

      if (clusterError) {
        console.error('Error updating cluster:', clusterError);
      }

      console.log(`✓ Added article to cluster ${clusterId}`);
    } catch (error) {
      console.error('Error in addToCluster:', error);
    }
  }

  /**
   * Generate a normalized cluster title from multiple article headlines
   * Takes the most common keywords and entities
   */
  private generateClusterTitle(headlines: string[]): string {
    // Extract all entities
    const allEntities = headlines.flatMap(h => extractEntities(h));

    // Find most common entity
    const entityCounts: Record<string, number> = {};
    for (const entity of allEntities) {
      entityCounts[entity] = (entityCounts[entity] || 0) + 1;
    }

    const topEntity = Object.entries(entityCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    if (topEntity) {
      // Use the first headline that mentions the top entity
      const representativeHeadline = headlines.find(h =>
        h.toLowerCase().includes(topEntity)
      );

      if (representativeHeadline) {
        // Simplify the headline (remove excessive details)
        return representativeHeadline.split(/[:\-—]/)[0].trim();
      }
    }

    // Fallback: use the shortest headline
    return headlines.sort((a, b) => a.length - b.length)[0];
  }

  /**
   * Main clustering method
   * Process a new article and assign it to a cluster
   */
  async clusterArticle(articleId: string): Promise<string | null> {
    try {
      // Fetch article details
      const { data: article, error } = await this.supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error || !article) {
        console.error('Error fetching article:', error);
        return null;
      }

      console.log(`\nClustering article: "${article.title}"`);

      // Try to find existing cluster
      const existingClusterId = await this.findClusterForArticle(article);

      let clusterId: string | null = null;

      if (existingClusterId) {
        // Add to existing cluster
        clusterId = existingClusterId;
        await this.addToCluster(clusterId, articleId);
      } else {
        // Create new cluster
        clusterId = await this.createCluster(article);
      }

      // Update article with cluster_id
      if (clusterId) {
        const { error: updateError } = await this.supabase
          .from('articles')
          .update({ story_cluster_id: clusterId })
          .eq('id', articleId);

        if (updateError) {
          console.error('Error updating article with cluster_id:', updateError);
        }
      }

      return clusterId;
    } catch (error) {
      console.error('Error in clusterArticle:', error);
      return null;
    }
  }

  /**
   * Update cluster's representative articles (left/center/right)
   * Called after new articles are added to a cluster
   */
  async updateClusterRepresentatives(clusterId: string): Promise<void> {
    try {
      // Get all articles in this cluster with their source bias
      const { data: articles, error } = await this.supabase
        .from('articles')
        .select(`
          id,
          title,
          polarization_score,
          sources (
            id,
            economic_score
          )
        `)
        .eq('story_cluster_id', clusterId);

      if (error || !articles || articles.length === 0) {
        return;
      }

      // Classify articles by bias
      const leftArticles = articles.filter(a => a.sources.economic_score < -2);
      const centerArticles = articles.filter(a =>
        a.sources.economic_score >= -2 && a.sources.economic_score <= 2
      );
      const rightArticles = articles.filter(a => a.sources.economic_score > 2);

      // Pick best representative for each category (lowest polarization = most factual)
      const leftRep = leftArticles.sort((a, b) =>
        (a.polarization_score || 100) - (b.polarization_score || 100)
      )[0]?.id;

      const centerRep = centerArticles.sort((a, b) =>
        (a.polarization_score || 100) - (b.polarization_score || 100)
      )[0]?.id;

      const rightRep = rightArticles.sort((a, b) =>
        (a.polarization_score || 100) - (b.polarization_score || 100)
      )[0]?.id;

      // Update cluster
      const { error: updateError } = await this.supabase
        .from('story_clusters')
        .update({
          left_article_id: leftRep,
          center_article_id: centerRep,
          right_article_id: rightRep,
          bias_coverage_map: {
            left: leftArticles.length,
            center: centerArticles.length,
            right: rightArticles.length
          }
        })
        .eq('id', clusterId);

      if (updateError) {
        console.error('Error updating cluster representatives:', updateError);
      } else {
        console.log(`✓ Updated cluster representatives for ${clusterId}`);
      }
    } catch (error) {
      console.error('Error in updateClusterRepresentatives:', error);
    }
  }
}

export default ClusteringService;
