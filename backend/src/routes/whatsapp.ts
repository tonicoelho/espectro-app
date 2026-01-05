/**
 * WhatsApp Bot Webhook - The "Trojan Horse" for Growth
 * Allows users to forward links directly to WhatsApp for instant bias analysis
 *
 * Flow:
 * 1. User forwards link to @EspectroBot
 * 2. Webhook receives message
 * 3. Extract URL or analyze text
 * 4. Check if article exists in DB or trigger fast-track scrape
 * 5. Run bias analysis
 * 6. Respond with bias summary + magic link to web app
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { analyzeBias } from '../services/biasAnalyzer';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Hash phone number for LGPD compliance
 * Anonymize user phone numbers using SHA-256
 */
function hashPhoneNumber(phone: string): string {
  return crypto
    .createHash('sha256')
    .update(phone + process.env.JWT_SECRET!)
    .digest('hex');
}

/**
 * Extract URL from WhatsApp message
 */
function extractURL(message: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = message.match(urlRegex);
  return matches ? matches[0] : null;
}

/**
 * Generate magic link to story cluster in web app
 */
function generateMagicLink(clusterId: string): string {
  const webAppUrl = process.env.WEB_APP_URL || 'https://espectro.app';
  return `${webAppUrl}/story/${clusterId}?utm_source=whatsapp&utm_medium=bot`;
}

/**
 * Check if article exists in database
 */
async function findArticleByURL(url: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      source:sources(*),
      story_cluster:story_clusters(id, title)
    `)
    .eq('url', url)
    .single();

  if (error) return null;
  return data;
}

/**
 * Fast-track scrape for new URL
 * Lightweight scrape just to get title, snippet, and source
 */
async function fastTrackScrape(url: string) {
  try {
    // Basic fetch to get metadata
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EspectroBot/1.0 (+https://espectro.app; contact@espectro.app)'
      },
      signal: AbortSignal.timeout(5000) // 5s timeout for fast response
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract basic metadata (simplified)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Título não disponível';

    // Detect source from URL
    const hostname = new URL(url).hostname;
    let sourceName = 'Fonte Desconhecida';

    if (hostname.includes('g1.globo.com')) sourceName = 'G1';
    else if (hostname.includes('folha.uol.com.br')) sourceName = 'Folha de S.Paulo';
    else if (hostname.includes('estadao.com.br')) sourceName = 'O Estado de S. Paulo';

    return { title, url, source_name: sourceName };

  } catch (error) {
    console.error('Fast-track scrape error:', error);
    return null;
  }
}

/**
 * Format bias analysis response for WhatsApp
 */
function formatWhatsAppResponse(
  article: any,
  polarizationScore: number,
  clusterId?: string
): string {
  const institutionalLabel =
    article.source.institutional_score >= 3
      ? 'Pró-Institucional'
      : 'Anti-Sistema';

  const magicLink = clusterId ? generateMagicLink(clusterId) : null;

  let response = `🔍 *Espectro Analysis*\n\n`;
  response += `📰 *Fonte:* ${article.source.name}\n`;
  response += `📊 *Polarização:* ${polarizationScore}/100 `;

  if (polarizationScore < 30) response += `(Factual)\n`;
  else if (polarizationScore < 70) response += `(Moderado)\n`;
  else response += `(Alta)\n`;

  response += `⚖️ *Z-Axis:* ${institutionalLabel}\n`;

  if (magicLink) {
    response += `\n🔗 *Ver outras perspectivas:*\n${magicLink}`;
  }

  return response;
}

/**
 * Main WhatsApp webhook endpoint
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const {
      From: fromPhone,
      Body: messageBody,
      MessageSid,
    } = req.body;

    console.log(`\n📱 WhatsApp message received from ${fromPhone}`);
    console.log(`Message: ${messageBody}`);

    // Hash phone number for LGPD compliance
    const hashedPhone = hashPhoneNumber(fromPhone);

    // Extract URL from message
    const url = extractURL(messageBody);

    if (!url) {
      // No URL found - treat as text snippet analysis (future feature)
      const response =
        '⚠️ Nenhum link detectado.\n\n' +
        'Envie um link de notícia para análise de viés!\n\n' +
        'Exemplo: https://g1.globo.com/...';

      return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${response}</Message>
</Response>`);
    }

    console.log(`🔗 Analyzing URL: ${url}`);

    // Check if article already exists in database
    let article = await findArticleByURL(url);
    let polarizationScore: number;
    let clusterId: string | undefined;

    if (article) {
      // Article exists - use cached data
      console.log(`✓ Article found in database`);
      polarizationScore = article.polarization_score || 50;
      clusterId = article.story_cluster?.id;

    } else {
      // New article - fast-track scrape + analysis
      console.log(`⚡ Fast-track scraping...`);

      const scrapedData = await fastTrackScrape(url);

      if (!scrapedData) {
        const errorResponse =
          '❌ Não foi possível acessar este link.\n\n' +
          'Verifique se o URL está correto.';

        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${errorResponse}</Message>
</Response>`);
      }

      // Get source from database
      const { data: source } = await supabase
        .from('sources')
        .select('*')
        .eq('name', scrapedData.source_name)
        .single();

      if (!source) {
        const errorResponse = `⚠️ Fonte "${scrapedData.source_name}" não reconhecida.\n\nAinda não rastreamos esta fonte.`;

        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${errorResponse}</Message>
</Response>`);
      }

      // Save article to database (minimal for now)
      const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert({
          source_id: source.id,
          title: scrapedData.title,
          url: scrapedData.url,
          snippet: scrapedData.title, // Use title as snippet for now
          published_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
        })
        .select(`*, source:sources(*)`)
        .single();

      if (insertError || !newArticle) {
        console.error('Error saving article:', insertError);
        polarizationScore = 50; // Default
        article = { source, title: scrapedData.title };
      } else {
        // Trigger bias analysis
        console.log(`🤖 Running bias analysis...`);
        polarizationScore = (await analyzeBias(newArticle.id)) || 50;
        article = newArticle;
      }
    }

    // Log to whatsapp_bot_logs (LGPD-compliant)
    const processingStartTime = Date.now();
    await supabase
      .from('whatsapp_bot_logs')
      .insert({
        phone_number: hashedPhone, // Hashed!
        url_analyzed: url,
        source_detected_id: article.source.id,
        bias_scores: {
          economic: article.source.economic_score,
          social: article.source.social_score,
          institutional: article.source.institutional_score,
        },
        polarization_score: polarizationScore,
        processing_time_ms: Date.now() - processingStartTime,
      });

    // Format response
    const responseText = formatWhatsAppResponse(article, polarizationScore, clusterId);

    console.log(`✓ Response sent (${Date.now() - processingStartTime}ms)`);

    // Send Twilio TwiML response
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseText}</Message>
</Response>`);

  } catch (error) {
    console.error('WhatsApp webhook error:', error);

    const errorResponse = '❌ Erro interno. Tente novamente em alguns instantes.';

    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${errorResponse}</Message>
</Response>`);
  }
});

/**
 * Twilio webhook verification (GET request)
 */
router.get('/webhook', (req: Request, res: Response) => {
  res.status(200).send('Espectro WhatsApp Bot is running! 🇧🇷');
});

export default router;
