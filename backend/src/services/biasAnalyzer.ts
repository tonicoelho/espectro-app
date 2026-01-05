/**
 * Bias Analyzer Service
 * Connects to OpenAI/Gemini and analyzes article bias
 * Uses the prompt templates from biasAnalysisPrompt.ts
 */

import { createClient } from '@supabase/supabase-js';
import {
  BIAS_ANALYSIS_PROMPT_TEMPLATE,
  GEMINI_BIAS_ANALYSIS_PROMPT_TEMPLATE,
  fillPromptTemplate,
  validateBiasAnalysis,
  BiasAnalysisResult
} from './biasAnalysisPrompt';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Call OpenAI GPT-4 Turbo for bias analysis
 */
async function analyzeWithOpenAI(
  title: string,
  text: string,
  sourceName: string,
  region: string
): Promise<BiasAnalysisResult | null> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      return null;
    }

    const prompt = fillPromptTemplate(BIAS_ANALYSIS_PROMPT_TEMPLATE, {
      title,
      text,
      source_name: sourceName,
      region
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a Brazilian media bias analyst specializing in the 2026 election context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for consistency
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('No content in OpenAI response');
      return null;
    }

    // Parse JSON response
    const result = JSON.parse(content) as BiasAnalysisResult;

    // Validate result
    if (!validateBiasAnalysis(result)) {
      console.error('Invalid bias analysis result from OpenAI');
      return null;
    }

    return result;

  } catch (error) {
    console.error('Error in analyzeWithOpenAI:', error);
    return null;
  }
}

/**
 * Call Google Gemini 1.5 Pro as fallback
 */
async function analyzeWithGemini(
  title: string,
  text: string,
  sourceName: string
): Promise<BiasAnalysisResult | null> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GOOGLE_GEMINI_API_KEY');
      return null;
    }

    const prompt = fillPromptTemplate(GEMINI_BIAS_ANALYSIS_PROMPT_TEMPLATE, {
      title,
      text,
      source_name: sourceName,
      region: 'national'
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text;

    if (!content) {
      console.error('No content in Gemini response');
      return null;
    }

    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const result = JSON.parse(jsonContent) as BiasAnalysisResult;

    if (!validateBiasAnalysis(result)) {
      console.error('Invalid bias analysis result from Gemini');
      return null;
    }

    return result;

  } catch (error) {
    console.error('Error in analyzeWithGemini:', error);
    return null;
  }
}

/**
 * Main bias analysis function
 * Tries OpenAI first, falls back to Gemini
 */
export async function analyzeBias(articleId: string): Promise<number | null> {
  try {
    // Fetch article from database
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        sources (
          name,
          region
        )
      `)
      .eq('id', articleId)
      .single();

    if (error || !article) {
      console.error('Error fetching article:', error);
      return null;
    }

    // Prepare text for analysis (use full_text if available, else snippet)
    const textToAnalyze = article.full_text || article.snippet || article.title;

    console.log(`  🤖 Analyzing: "${article.title.substring(0, 50)}..."`);

    // Try OpenAI first
    let result = await analyzeWithOpenAI(
      article.title,
      textToAnalyze,
      article.sources.name,
      article.sources.region || 'national'
    );

    // Fallback to Gemini if OpenAI fails
    if (!result) {
      console.log('  ⚠ OpenAI failed, trying Gemini...');
      result = await analyzeWithGemini(
        article.title,
        textToAnalyze,
        article.sources.name
      );
    }

    if (!result) {
      console.error('  ✗ Both AI providers failed');
      return null;
    }

    // Save bias analysis results to database
    const { error: updateError } = await supabase
      .from('articles')
      .update({
        polarization_score: result.polarization_score,
        polarization_reasoning: result.reasoning,
        keywords: result.keywords,
        // Store institutional markers in a separate JSONB column if needed
        // For now, we'll add them to reasoning
      })
      .eq('id', articleId);

    if (updateError) {
      console.error('Error updating article with bias score:', updateError);
      return null;
    }

    console.log(`  ✓ Bias score: ${result.polarization_score}/100`);
    console.log(`  Z-Axis markers: ${JSON.stringify(result.institutional_markers)}`);

    return result.polarization_score;

  } catch (error) {
    console.error('Error in analyzeBias:', error);
    return null;
  }
}

export default analyzeBias;
