/**
 * AI Bias Analysis Prompt Templates
 *
 * Based on spec.md Section 6.5 - Bias Analysis Pipeline
 * Enhanced for Brazil's unique political landscape (2026 elections)
 *
 * KEY REFINEMENT (per user request):
 * Z-Axis (Institutionalism) is the MOST IMPORTANT differentiator for 2026
 * The divide is no longer just Left/Right, but "Pro-STF" vs "Anti-STF"
 */

export interface BiasAnalysisResult {
  polarization_score: number; // 0-100
  keywords: string[];
  reasoning: string;
  institutional_markers: {
    pro_establishment: string[];
    anti_system: string[];
  };
  regional_context?: string; // Center-West agricultural vs Southeast urban
}

/**
 * Main GPT-4 Turbo Prompt for Brazilian News Bias Analysis
 *
 * IMPORTANT: This prompt explicitly weights Z-Axis (Institutionalism)
 * terms like "ativismo judicial" or "defesa da democracia"
 */
export const BIAS_ANALYSIS_PROMPT_TEMPLATE = `
You are an expert analyst of Brazilian political media bias, specializing in the 2026 election context.

CRITICAL CONTEXT FOR 2026:
The main political divide in Brazil is now "Pro-STF/Establishment" vs "Anti-STF/Anti-System" (Z-Axis).
This is MORE important than traditional Left/Right economic divisions.

Article to Analyze:
---
Title: {{title}}
Text: {{text}}
Source: {{source_name}}
Region: {{region}}
---

Your Task:
Analyze this article for political bias across THREE dimensions:

1. POLARIZATION SCORE (0-100):
   - 0-30: LOW - Factual reporting, multiple sources, balanced language
   - 31-70: MODERATE - Some loaded language, partial viewpoints
   - 71-100: HIGH - Highly emotional, one-sided, opinion-heavy

2. KEYWORDS (5 terms):
   Extract the 5 most politically significant terms that reveal bias.

3. INSTITUTIONAL MARKERS (Z-Axis - MOST IMPORTANT):
   Identify language that signals position on judiciary/democracy:

   Pro-Establishment indicators:
   - "defesa da democracia", "Estado de Direito"
   - "decisão do STF", "respeito às instituições"
   - "combate à desinformação"

   Anti-System indicators:
   - "ativismo judicial", "ditadura do judiciário"
   - "censura", "perseguição política"
   - "velha guarda", "establishment corrupto"
   - "golpe" (when referring to impeachment or electoral process)

4. REGIONAL CONTEXT BIAS:
   Does this article show:
   - Center-West agricultural perspective? (agribusiness, rural values)
   - Southeast urban perspective? (progressive social issues, tech economy)

   Note if framing might fail to represent one region's concerns.

EXAMPLES OF HIGH POLARIZATION (70+):

Left-wing Anti-System:
"O golpe judicial de 2024 mostra como o STF se tornou instrumento da elite para silenciar o povo."
→ High polarization: "golpe judicial", "elite", "silenciar o povo"
→ Anti-System markers: "golpe judicial", "instrumento da elite"

Right-wing Anti-System:
"Ditadura do STF impõe censura ditatorial contra defensores da liberdade de expressão."
→ High polarization: "ditadura", "censura ditatorial"
→ Anti-System markers: "ditadura do STF", "censura"

Pro-Establishment Center:
"STF reafirma compromisso com a democracia ao barrar candidatura de político ficha-suja."
→ Moderate polarization: Positive framing but balanced
→ Pro-Establishment markers: "compromisso com a democracia", "defesa das instituições"

EXAMPLES OF LOW POLARIZATION (0-30):

Factual:
"Supremo Tribunal Federal decidiu, por 7 votos a 4, tornar Bolsonaro inelegível até 2030."
→ Low polarization: Factual, no emotional language
→ Neutral: Reports decision without value judgment

Response Format (JSON only):
{
  "polarization_score": <number 0-100>,
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "reasoning": "<brief explanation of score in Portuguese>",
  "institutional_markers": {
    "pro_establishment": ["term1", "term2"],
    "anti_system": ["term1", "term2"]
  },
  "regional_context": "<'center_west_agricultural' | 'southeast_urban' | 'balanced' | 'not_applicable'>"
}

IMPORTANT:
- Be culturally sensitive to Brazilian political nuances
- 2026 context: Focus on STF, democracy, and institutional trust as primary dividers
- Hidden bias: Check if agricultural news (Center-West) is framed as "backward" by urban sources
- Respond ONLY with valid JSON, no additional text
`;

/**
 * Fallback Gemini 1.5 Pro Prompt (if OpenAI rate-limited)
 * Simplified for Google's model style
 */
export const GEMINI_BIAS_ANALYSIS_PROMPT_TEMPLATE = `
Analyze this Brazilian news article for political bias (2026 election context).

Article:
Title: {{title}}
Text: {{text}}
Source: {{source_name}}

Provide:
1. Polarization score (0-100)
2. 5 keywords showing bias
3. Explanation
4. Position on STF/judiciary (Pro-Establishment vs Anti-System)

Focus on Z-Axis: Is this Pro-STF or Anti-STF? This is the key divide in 2026.

Respond in JSON:
{
  "polarization_score": <number>,
  "keywords": ["k1", "k2", "k3", "k4", "k5"],
  "reasoning": "<explanation>",
  "institutional_markers": {
    "pro_establishment": [],
    "anti_system": []
  }
}
`;

/**
 * Template replacement helper
 */
export function fillPromptTemplate(
  template: string,
  variables: {
    title: string;
    text: string;
    source_name: string;
    region?: string;
  }
): string {
  return template
    .replace('{{title}}', variables.title)
    .replace('{{text}}', variables.text)
    .replace('{{source_name}}', variables.source_name)
    .replace('{{region}}', variables.region || 'national');
}

/**
 * Validation: Does AI response include Z-Axis markers?
 * If not, flag for human review
 */
export function validateBiasAnalysis(result: BiasAnalysisResult): boolean {
  const hasInstitutionalMarkers =
    result.institutional_markers.pro_establishment.length > 0 ||
    result.institutional_markers.anti_system.length > 0;

  const hasKeywords = result.keywords && result.keywords.length === 5;
  const hasValidScore = result.polarization_score >= 0 && result.polarization_score <= 100;

  return hasInstitutionalMarkers && hasKeywords && hasValidScore;
}
