/**
 * Article Ingestion Service
 * Processes scraped articles: saves to DB → clusters → triggers AI analysis
 */

import { createClient } from '@supabase/supabase-js';
import { ClusteringService } from './clusteringService';
import { analyzeBias } from './biasAnalyzer';

interface ScrapedArticle {
  title: string;
  url: string;
  snippet: string;
  source_name: string;
  published_at: string;
  image_url?: string;
  author?: string;
  full_text?: string;
}

export class ArticleIngestionService {
  private supabase;
  private clusteringService: ClusteringService;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    this.clusteringService = new ClusteringService();
  }

  /**
   * Get source_id from database by source name
   */
  private async getSourceId(sourceName: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('sources')
        .select('id')
        .eq('name', sourceName)
        .single();

      if (error || !data) {
        console.error(`Source "${sourceName}" not found in database`);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error fetching source ID:', error);
      return null;
    }
  }

  /**
   * Check if article already exists in database (by URL)
   */
  private async articleExists(url: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('articles')
      .select('id')
      .eq('url', url)
      .single();

    return !!data;
  }

  /**
   * Save article to database
   */
  private async saveArticle(
    article: ScrapedArticle,
    sourceId: string
  ): Promise<string | null> {
    try {
      // Check if article already exists
      if (await this.articleExists(article.url)) {
        console.log(`  ⊘ Article already exists: ${article.url}`);
        return null;
      }

      const { data, error } = await this.supabase
        .from('articles')
        .insert({
          source_id: sourceId,
          title: article.title,
          snippet: article.snippet,
          full_text: article.full_text,
          url: article.url,
          image_url: article.image_url,
          author: article.author,
          published_at: article.published_at,
          scraped_at: new Date().toISOString(),
          is_breaking: false // TODO: Implement breaking news detection
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving article:', error);
        return null;
      }

      console.log(`  ✓ Saved article: ${article.title.substring(0, 60)}...`);
      return data.id;
    } catch (error) {
      console.error('Error in saveArticle:', error);
      return null;
    }
  }

  /**
   * Process a batch of scraped articles
   * Full pipeline: Save → Cluster → Analyze bias
   */
  async processBatch(articles: ScrapedArticle[]): Promise<void> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing ${articles.length} articles`);
    console.log(`${'='.repeat(60)}\n`);

    let savedCount = 0;
    let clusteredCount = 0;
    let analyzedCount = 0;

    for (const article of articles) {
      try {
        // 1. Get source_id
        const sourceId = await this.getSourceId(article.source_name);
        if (!sourceId) {
          console.error(`  ✗ No source_id for "${article.source_name}"`);
          continue;
        }

        // 2. Save to database
        const articleId = await this.saveArticle(article, sourceId);
        if (!articleId) {
          continue; // Already exists or error
        }
        savedCount++;

        // 3. Cluster article
        console.log(`  📊 Clustering...`);
        const clusterId = await this.clusteringService.clusterArticle(articleId);
        if (clusterId) {
          clusteredCount++;

          // Update cluster representatives (for Comparison Slider)
          await this.clusteringService.updateClusterRepresentatives(clusterId);
        }

        // 4. Trigger AI bias analysis
        console.log(`  🤖 Analyzing bias...`);
        const biasScore = await analyzeBias(articleId);
        if (biasScore !== null) {
          analyzedCount++;
          console.log(`  ✓ Bias analysis complete (score: ${biasScore})`);
        }

        console.log(''); // Blank line between articles

      } catch (error) {
        console.error(`Error processing article: ${article.title}`, error);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('BATCH PROCESSING COMPLETE');
    console.log(`${'='.repeat(60)}`);
    console.log(`Saved: ${savedCount}/${articles.length}`);
    console.log(`Clustered: ${clusteredCount}/${savedCount}`);
    console.log(`Analyzed: ${analyzedCount}/${savedCount}`);
    console.log(`${'='.repeat(60)}\n`);
  }

  /**
   * Process a single JSON file from scrapers/output/
   */
  async processScraperOutput(jsonData: any): Promise<void> {
    if (!jsonData.articles || !Array.isArray(jsonData.articles)) {
      throw new Error('Invalid scraper output format');
    }

    console.log(`\nProcessing scraper output from: ${jsonData.source}`);
    console.log(`Scraped at: ${jsonData.scraped_at}`);
    console.log(`Article count: ${jsonData.article_count}`);
    console.log(`Data-Lite Mode: ${jsonData.data_lite_mode ? 'ON' : 'OFF'}`);

    await this.processBatch(jsonData.articles);
  }
}

export default ArticleIngestionService;
