# 📊 Espectro Data Pipeline - Phase 1

**Status:** ✅ Complete (Weeks 3-5)

---

## 🎯 Overview

The Data Pipeline is the backbone of Espectro. It scrapes Brazilian news sources, clusters articles by story, and analyzes bias using AI.

**Flow:**
```
Scrapers → JSON Output → Backend Ingestion → Database → Clustering → AI Analysis
```

---

## 🏗 Architecture

### 1. Python Scrapers (`scrapers/`)

**The "Big Three" Brazilian News Sources:**
- **G1** (Globo) - Pro-establishment, Centrist
- **Folha de S.Paulo** - Center-left, Pro-STF
- **Estadão** - Center-right, Pro-STF

**Key Features:**
- ✅ **Robots.txt Compliance** - Respectful scraping
- ✅ **Rate Limiting** - Configurable crawl delays
- ✅ **Data-Lite Mode** - Strips images for bandwidth savings (45% of Brazilian market on prepaid!)
- ✅ **JSON Output** - Structured data for backend processing

### 2. Clustering Service (`backend/src/services/clusteringService.ts`)

Groups articles covering the **same event** for the Comparison Slider.

**Algorithm:**
- **String Similarity** (40% weight) - Levenshtein distance on normalized headlines
- **Entity Overlap** (40% weight) - Extracts politicians, institutions (Bolsonaro, STF, Lula, etc.)
- **Keyword Overlap** (20% weight) - Common words after stop-word removal

**Threshold:** 65% similarity = same cluster

### 3. Bias Analyzer (`backend/src/services/biasAnalyzer.ts`)

Uses AI to score articles on the **Z-Axis (Institutionalism)** - the KEY divide for 2026.

**Providers:**
- **Primary:** OpenAI GPT-4 Turbo
- **Fallback:** Google Gemini 1.5 Pro

**Output:**
- `polarization_score` (0-100)
- `keywords` (5 key terms revealing bias)
- `institutional_markers` (Pro-STF vs Anti-STF terms)
- `regional_context` (Center-West agricultural vs Southeast urban)

### 4. Ingestion Service (`backend/src/services/articleIngestion.ts`)

Orchestrates the full pipeline:
1. Save article to database
2. Assign to cluster (or create new cluster)
3. Trigger AI bias analysis
4. Update cluster representatives (for Comparison Slider)

---

## 🚀 Quick Start

### Step 1: Install Python Dependencies

```bash
cd scrapers
pip install -r requirements.txt
```

### Step 2: Set Up Environment Variables

Create `scrapers/.env`:
```bash
# Optional: For direct database ingestion
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Data-Lite Mode (default: true)
DATA_LITE_MODE=true
```

Create `backend/.env`:
```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
```

### Step 3: Run Scrapers

```bash
cd scrapers

# Run all scrapers
python run_scrapers.py

# Run specific scraper
python run_scrapers.py --source g1
python run_scrapers.py --source folha
python run_scrapers.py --source estadao

# Force Data-Lite Mode
python run_scrapers.py --lite

# Verbose logging
python run_scrapers.py --verbose
```

**Output:** JSON files in `scrapers/output/`

Example: `g1_20260105_143000.json`

### Step 4: Process Scraped Articles

```bash
cd backend

# Process all scraper outputs
ts-node src/scripts/process-scraped-articles.ts --all

# Process specific file
ts-node src/scripts/process-scraped-articles.ts ../scrapers/output/g1_20260105_143000.json
```

**This will:**
1. ✅ Save articles to Supabase `articles` table
2. ✅ Cluster articles into `story_clusters`
3. ✅ Analyze bias with GPT-4/Gemini
4. ✅ Update cluster representatives (left/center/right)

---

## 📁 Directory Structure

```
espectro-app/
├── scrapers/                         # Python scrapers
│   ├── config.py                    # Centralized configuration
│   ├── requirements.txt             # Python dependencies
│   ├── run_scrapers.py              # Main CLI runner
│   │
│   ├── utils/
│   │   └── robots_checker.py        # Robots.txt compliance
│   │
│   ├── scrapers/
│   │   ├── base_scraper.py          # Base class for all scrapers
│   │   ├── g1_scraper.py            # G1 (Globo)
│   │   ├── folha_scraper.py         # Folha de S.Paulo
│   │   └── estadao_scraper.py       # Estadão
│   │
│   ├── output/                      # Scraped JSON files
│   └── logs/                        # Scraper logs
│
├── backend/
│   └── src/
│       ├── services/
│       │   ├── clusteringService.ts      # Story clustering algorithm
│       │   ├── biasAnalyzer.ts           # AI bias analysis
│       │   ├── biasAnalysisPrompt.ts     # AI prompt templates (Z-Axis focus!)
│       │   └── articleIngestion.ts       # Main pipeline orchestrator
│       │
│       └── scripts/
│           └── process-scraped-articles.ts  # CLI to process JSON outputs
│
└── DATA_PIPELINE_README.md         # You are here
```

---

## 🔑 Key Features Implemented

### 1. **Robots.txt Checker** ✅

Every scraper checks `robots.txt` before fetching:
```python
from utils.robots_checker import check_url_allowed, wait_for_rate_limit

if not check_url_allowed(url):
    logger.warning(f"Skipping {url} - blocked by robots.txt")
    return

wait_for_rate_limit(url)  # Enforces crawl delay
```

**Why this matters:** Respectful scraping prevents IP bans and legal issues.

### 2. **Data-Lite Mode** ✅

Strips images and focuses on text + metadata:
```python
# In config.py
DATA_LITE_MODE = os.getenv("DATA_LITE_MODE", "true").lower() == "true"

# In scrapers
if not DATA_LITE_MODE:
    article.image_url = extract_image_url()
else:
    article.image_url = None  # Save bandwidth!
```

**Why this matters:** 45% of Brazilians use prepaid mobile plans. Every MB counts.

### 3. **Z-Axis (Institutionalism) Focus** ✅

The AI analyzer prioritizes **Pro-STF vs Anti-STF** markers:
```typescript
// From biasAnalysisPrompt.ts
Pro-Establishment indicators:
- "defesa da democracia", "Estado de Direito", "respeito às instituições"

Anti-System indicators:
- "ativismo judicial", "ditadura do judiciário", "censura", "perseguição política"
```

**Why this matters:** The 2026 election is NOT Left vs Right, it's **Pro-STF vs Anti-STF**.

### 4. **Clustering with Entity Extraction** ✅

Extracts Brazilian political entities:
```typescript
const politicians = [
  'Bolsonaro', 'Lula', 'Alckmin', 'Moraes', 'Fachin', 'Barroso'
];

const institutions = [
  'STF', 'STJ', 'TSE', 'Congresso', 'Senado', 'Câmara'
];
```

Articles mentioning the same entities (e.g., "Moraes" + "STF") are clustered together.

---

## 🧪 Testing the Pipeline

### Test 1: Run Scrapers

```bash
cd scrapers
python run_scrapers.py --source g1 --verbose
```

**Expected output:**
```
🇧🇷 Espectro News Scrapers
Data-Lite Mode: ON

============================================================
Running: G1
============================================================
✓ Fetching robots.txt from https://g1.globo.com/robots.txt
✓ Successfully parsed robots.txt for https://g1.globo.com
Found 20 article candidates on G1 homepage
  ✓ Scraped: STF decide sobre elegibilidade de Bolsonaro...
  ✓ Scraped: Inflação sobe 0,3% em dezembro, diz IBGE...
  ...
✓ G1: 18 articles scraped
✓ Saved 18 articles to output/g1_20260105_143000.json
```

### Test 2: Process Articles

```bash
cd backend
ts-node src/scripts/process-scraped-articles.ts --all
```

**Expected output:**
```
============================================================
Processing file: g1_20260105_143000.json
============================================================

Processing scraper output from: G1
Article count: 18
Data-Lite Mode: ON

============================================================
Processing 18 articles
============================================================

  ✓ Saved article: STF decide sobre elegibilidade de Bolsonaro...
  📊 Clustering...
  ✓ Found cluster match (similarity: 87.3%)
  ✓ Added article to cluster abc123...
  🤖 Analyzing bias...
  🤖 Analyzing: "STF decide sobre elegibilidade de Bolsona..."
  ✓ Bias score: 42/100
  Z-Axis markers: {"pro_establishment":["decisão do STF","Estado de Direito"],"anti_system":[]}

============================================================
BATCH PROCESSING COMPLETE
============================================================
Saved: 18/18
Clustered: 16/18
Analyzed: 18/18
============================================================
```

---

## 📊 Database Flow

### Before Scraping:
```sql
sources (G1, Folha, Estadão) → pre-populated with bias coordinates
articles → empty
story_clusters → empty
```

### After Scraping + Processing:
```sql
articles → 18 new articles
  - Each has: title, url, snippet, source_id, polarization_score, keywords

story_clusters → 5-8 clusters (depending on overlap)
  - Each cluster has: left_article_id, center_article_id, right_article_id
  - Powers the Comparison Slider!
```

---

## 🚨 Troubleshooting

### Issue 1: "Missing OPENAI_API_KEY"

**Solution:** Add API key to `backend/.env`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

Get key: https://platform.openai.com/api-keys

### Issue 2: Scrapers Blocked by Robots.txt

**Check logs:**
```bash
cat scrapers/logs/scrapers.log | grep "blocked by robots.txt"
```

**Solution:** Respect robots.txt! If a source blocks us, we need official API access or RSS feeds.

### Issue 3: Low Clustering Rate

If many articles create new clusters instead of joining existing ones:

**Adjust similarity threshold** in `clusteringService.ts`:
```typescript
private similarityThreshold = 0.65; // Try lowering to 0.55
```

### Issue 4: High AI Analysis Costs

OpenAI GPT-4 costs ~$0.01-0.03 per article.

**Solutions:**
1. Use Gemini as primary (cheaper)
2. Cache results for 24 hours (don't re-analyze same article)
3. Batch processing (analyze 10 articles per API call)

---

## 🎯 Next Steps

### Phase 2: Expand to More Sources (Weeks 6-9)

Add scrapers for:
- **Left:** Brasil 247, Revista Fórum, Mídia Ninja
- **Right:** Revista Oeste, O Antagonista, Gazeta do Povo
- **Center:** UOL, CartaCapital, Metrópoles

Copy `scrapers/g1_scraper.py` as template.

### Phase 3: WhatsApp Bot Integration (Week 10)

The **"Trojan Horse" for Growth:**

Users forward links to WhatsApp bot → Bot analyzes bias → Returns score in <10s

**Implementation:**
1. Set up Twilio WhatsApp Business account
2. Create webhook: `POST /api/v1/whatsapp/analyze`
3. Use existing `biasAnalyzer.ts` for real-time analysis
4. Log to `whatsapp_bot_logs` table (anonymize after 30 days)

### Phase 4: RSS Feeds

Some sources have RSS feeds (easier than scraping):
```python
# In config.py
SOURCES = {
    "g1": {
        "rss": "https://g1.globo.com/rss/g1/",
    }
}
```

Use Python's `feedparser` library to parse RSS.

---

## 📝 Notes

### On Paywalls

**Folha and Estadão have paywalls.** Our scrapers only get:
- Headline
- Subtitle/snippet
- First paragraph (sometimes)

This is **sufficient for bias analysis** - headlines alone reveal bias!

Example:
- G1: "STF decide sobre elegibilidade de Bolsonaro"
- Folha: "STF barra Bolsonaro das eleições de 2026"
- Estadão: "Supremo impede retorno de Bolsonaro à política"

Same event, different framing = bias revealed!

### On Scraping Legality (Brazil)

**Brazilian Copyright Law (Lei 9.610/98), Article 46, I:**
> "Citation of excerpts is permitted for study, criticism, or news reporting"

**Our approach:**
- ✅ Display headline + snippet (≤280 chars)
- ✅ Always link to original source ("Read Full Article")
- ✅ Respect robots.txt
- ✅ Track click-through rate (aim for >40% to show we drive traffic)

### On Data-Lite Mode

**Why it's critical:**
- 45% of Brazilians use prepaid mobile plans
- Data costs: R$0.50/MB average
- WhatsApp is king because it's free (Zero Rating)

**Our solution:**
- Scrape text only (no images)
- Aggressive caching (24 hours)
- Target: <500KB per session

**Flutter implementation:**
```dart
if (user.dataLiteMode) {
  return SizedBox(
    decoration: BoxDecoration(
      border: Border.all(color: biasColor, width: 3),
    ),
  );
}
```

---

## 🏆 Success Criteria

Phase 1 is complete when:
- ✅ 3 scrapers running (G1, Folha, Estadão)
- ✅ Robots.txt compliance implemented
- ✅ Data-Lite mode working
- ✅ Clustering algorithm groups 70%+ of articles correctly
- ✅ AI bias analysis has >85% accuracy vs. human experts
- ✅ Full pipeline runs end-to-end without errors

**Target:** 30-50 articles/day from the Big Three = enough data to test Comparison Slider UI

---

## 📞 Need Help?

- **Scrapers not working?** Check `scrapers/logs/scrapers.log`
- **Database errors?** Verify Supabase credentials in `.env`
- **AI analysis failing?** Check OpenAI/Gemini API keys and quotas
- **Clustering issues?** Adjust `similarityThreshold` in `clusteringService.ts`

---

**Made with ❤️ for Brazilian democracy**

*Phase 1 Complete - On to Phase 2! 🚀*
