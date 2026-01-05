# Methodology Audit Process with Gemini 1.5 Pro

## Purpose
Before deploying the bias analysis system to production, we MUST validate that our framework (X, Y, Z axes) is robust enough to handle the complexity of Brazilian political media.

This audit process uses **Gemini 1.5 Pro** as a "red team" to find edge cases where our framework might fail or be too simplistic.

---

## Step 1: Framework Summary for Gemini

**Our Bias Classification Framework:**

### X-Axis: Economic (Market vs. State)
- **+5 (Market-Driven):** Privatization, fiscal austerity, free trade
  - Example Sources: Revista Oeste, O Antagonista
- **-5 (State-Driven):** Social programs, state intervention, protectionism
  - Example Sources: Brasil 247, Revista Fórum

### Y-Axis: Social (Progressive vs. Conservative)
- **+5 (Progressive):** LGBTQ+ rights, secularism, environmental policy
  - Example Sources: The Intercept Brasil, Carta Capital
- **-5 (Conservative):** Religious values, traditional family, law & order
  - Example Sources: Gazeta do Povo, Jovem Pan

### Z-Axis: Institutionalism (Pro-Establishment vs. Anti-System)
- **+5 (Pro-Establishment):** Respect for judiciary (STF), democratic norms
  - Example Sources: Folha, Estadão, Globo
- **-5 (Anti-System):** Criticism of STF, "Old Guard" politicians
  - Example Sources: Both far-left and far-right outlets
  - **KEY REFINEMENT:** This is the MOST IMPORTANT axis for 2026 elections

---

## Step 2: Gemini 1.5 Pro Audit Prompt

Use this prompt to identify framework weaknesses:

```
I am building a news bias tracker for Brazil's 2026 elections.

My classification framework uses three axes:
1. X-Axis: Economic (Market-Driven vs. State-Driven)
2. Y-Axis: Social (Progressive vs. Conservative)
3. Z-Axis: Institutionalism (Pro-STF/Establishment vs. Anti-STF/Anti-System)

TASK:
Based on Brazil's 2024 municipal elections and recent political developments, find 5 real news stories where this framework might:
- FAIL to classify accurately
- Be TOO SIMPLISTIC
- Miss important regional biases (e.g., Center-West agricultural news vs. Southeast urban news)
- Not capture "hidden" bias in framing

For each story, provide:
1. Headline and source
2. Why the framework struggles
3. Suggested adjustment to the NLP analysis

FOCUS AREAS:
- Stories about agribusiness (Center-West perspective)
- Environmental policy (Amazon deforestation, indigenous rights)
- Religious topics (evangelical influence in politics)
- STF decisions (the Z-Axis is crucial - test its limits)
- Regional development (North/Northeast vs. South/Southeast)

Provide specific examples from 2024-2025 Brazilian news.
```

---

## Step 3: Expected Output & Analysis

Gemini should return edge cases like:

### Example Edge Case 1: Agribusiness in the Amazon
**Headline:** "Agricultores do Pará defendem expansão de áreas produtivas"
**Source:** A Crítica (Manaus)

**Why Framework Struggles:**
- Economic axis: Could be +5 (pro-market expansion)
- Social axis: -5 (against indigenous land rights)
- Z-Axis: Unclear (local development vs. federal environmental law)
- **Hidden bias:** Urban Southeast sources might frame this as "destructive" while local sources see it as "development"

**Suggested Adjustment:**
- Add **regional weighting** to NLP: Detect if article uses "desenvolvimento" (development) vs "destruição" (destruction) when discussing the same agricultural expansion
- Flag articles where economic development conflicts with social/environmental values
- Create sub-category: "Regional Economic Interests" that might not align with national left/right divide

### Example Edge Case 2: Evangelical Political Power
**Headline:** "Bancada evangélica vota contra liberação do aborto"
**Source:** Gazeta do Povo

**Why Framework Struggles:**
- Y-Axis: -5 (Conservative on social issues) ✓
- X-Axis: Could be 0 (evangelicals span economic spectrum)
- Z-Axis: Could be +5 OR -5 depending on specific evangelical leader's stance on STF
- **Hidden bias:** Secular progressive sources might frame evangelical influence as "threat to democracy" (mixing Y-Axis with Z-Axis)

**Suggested Adjustment:**
- When detecting religious keywords, check if article also uses "ameaça à democracia" or "liberdade religiosa"
- This reveals if outlet conflates social conservatism (Y-Axis) with anti-institutional sentiment (Z-Axis)
- Add keyword pair detection: "evangélico" + "democracia" → Check if positive or negative framing

### Example Edge Case 3: STF Censorship of Social Media
**Headline:** "STF ordena bloqueio de perfis críticos ao governo"
**Source:** Could be reported by BOTH left and right outlets

**Why Framework Struggles:**
- Left-wing source might support (Z-Axis: +5, Pro-STF)
- Right-wing source might oppose (Z-Axis: -5, Anti-STF)
- **BUT:** Some left-wing outlets might also criticize if they value free speech
- **Hidden bias:** Same action (STF censorship) could be framed as "protecting democracy" or "authoritarian overreach" depending on Z-Axis position

**Suggested Adjustment:**
- Create **action-framing matrix:** Track how different sources frame the SAME STF action
- Keywords to detect:
  - Pro-Establishment: "combate à desinformação", "proteção da democracia"
  - Anti-System: "censura", "autoritarismo judicial", "perseguição política"
- This helps identify when outlets prioritize institutional loyalty (Z-Axis) over ideological consistency (X/Y Axes)

---

## Step 4: Implementing Adjustments

Based on Gemini's findings, update the NLP analysis in `biasAnalysisPrompt.ts`:

### Adjustment 1: Regional Bias Detection
Add to the prompt:
```typescript
"REGIONAL FRAMING:
Does this article frame regional economic interests (e.g., agribusiness, mining) as:
- 'Development' and 'jobs' (local/pro-business perspective)
- 'Destruction' and 'exploitation' (urban/environmental perspective)

Flag articles where Southeast urban sources may not represent Center-West/North perspectives fairly."
```

### Adjustment 2: Action-Framing Matrix for STF
Add tracking for:
```typescript
"STF ACTION FRAMING:
If article discusses STF decision, identify:
1. The ACTION (e.g., 'censorship', 'eligibility ruling', 'corruption investigation')
2. The FRAMING:
   - Positive: 'defesa', 'proteção', 'combate'
   - Negative: 'censura', 'perseguição', 'autoritarismo'
   - Neutral: 'decisão', 'determinou', 'julgou'

This reveals Z-Axis position more accurately than economic/social axes."
```

### Adjustment 3: Keyword Pair Detection
```typescript
"CONFLATION DETECTION:
Look for keyword pairs that mix axes:
- 'evangélico' + 'ameaça' → Conflating social conservatism (Y) with anti-democratic (Z)
- 'agronegócio' + 'destruição' → Conflating economic development (X) with environmental harm (Y)

Flag when outlet uses one axis to imply another without evidence."
```

---

## Step 5: Validation Loop

After implementing adjustments:

1. **Re-run Gemini audit** with the SAME 5 edge cases
2. Check if updated NLP now captures the nuances
3. **Manual verification:** Have 3 political scientists review the AI scores for 50 articles
4. **Target accuracy:** >85% agreement between AI and human experts

---

## Step 6: Continuous Improvement

**Monthly Gemini Audits:**
- Submit 10 most-viewed articles from the past month
- Ask Gemini: "Did our framework misclassify any of these?"
- Update prompts based on findings

**Community Challenges:**
- Allow premium users to flag "Bias Rating Seems Wrong"
- Use Gemini to analyze user challenges and validate if adjustment needed

---

## Key Takeaways

### Why This Audit Matters:
1. **Brazilian politics is complex** - Not just Left vs. Right
2. **Regional differences** - Center-West agricultural vs. Southeast urban framing
3. **Z-Axis is critical** - Pro-STF vs. Anti-STF is THE divide in 2026
4. **Hidden biases** - Outlets use economic/social framing to imply institutional positions

### How Gemini Helps:
- **Red team**: Finds edge cases you didn't anticipate
- **Diverse perspective**: Google's model trained on different data than OpenAI
- **Brazilian context**: Gemini 1.5 Pro has strong Portuguese and regional knowledge
- **Fallback validator**: If OpenAI misses something, Gemini might catch it

### Success Criteria:
- ✅ Framework handles agribusiness stories without urban bias
- ✅ Correctly separates social conservatism (Y-Axis) from anti-institutionalism (Z-Axis)
- ✅ Detects when outlets frame STF actions differently based on Z-Axis position
- ✅ Identifies regional framing differences (North vs. South)
- ✅ >85% agreement with human expert panel

---

## Next Steps

1. [ ] Run initial Gemini audit with prompt from Step 2
2. [ ] Document 5+ edge cases Gemini identifies
3. [ ] Implement NLP adjustments in `biasAnalysisPrompt.ts`
4. [ ] Re-validate with human expert panel
5. [ ] Set up monthly automated Gemini audits
6. [ ] Create public "Methodology" page showing this process (transparency!)

**Timeline:** Complete before MVP launch (March 2026)

---

**Questions?**
This audit process should be documented publicly on the Espectro website under "Our Methodology" to build trust and demonstrate that the bias framework is rigorously validated.
