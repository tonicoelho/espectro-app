# Project Specification: Brazilian News Bias Tracker
## Code Name: "Espectro" (Spectrum)

**Version:** 1.0  
**Last Updated:** January 5, 2026  
**Target Launch:** Q1 2026 (Pre-Election Positioning)

---

## 1. Executive Summary

### Vision
Create Brazil's first comprehensive news bias tracking platform that helps citizens navigate political polarization by providing transparent, multi-perspective news coverage comparisons.

### Mission
Empower the "Pragmatic Voter" to break free from echo chambers and WhatsApp misinformation by providing immediate access to how different parts of the political spectrum frame breaking news events.

### Success Metrics (Year 1)
- 100,000+ monthly active users by October 2026 (election month)
- 50+ news sources classified and tracked
- 95%+ uptime during major breaking news events
- <2 second load time on 3G connections
- Net Promoter Score (NPS) > 40

---

## 2. Target User Personas

### Primary: The Pragmatic Voter
- **Age:** 25-45
- **Profile:** University-educated, urban/suburban, frustrated with polarization
- **Pain Points:** 
  - Overwhelmed by WhatsApp fake news from family groups
  - Wants to understand "the other side" without toxic comments
  - Distrusts single-source narratives
- **Use Case:** Opens app during breaking news (STF decisions, debate nights, economic announcements) to compare coverage

### Secondary: The Media Literacy Educator
- **Profile:** Teachers, journalists, NGO workers
- **Need:** Tools to teach critical media consumption
- **Use Case:** Uses app in classroom/workshop settings to demonstrate bias

### Tertiary: The Campaign Professional
- **Profile:** Political consultants, communication strategists
- **Need:** Real-time media monitoring across ideological spectrum
- **Use Case:** Premium subscriber tracking opponent narratives

---

## 3. Core Value Proposition

**"See the same news from all sides — before you decide."**

### Key Differentiators
1. **Brazilian-First:** Built for Brazil's unique political landscape (not imported US framework)
2. **WhatsApp Integration:** Bot listener for viral link verification
3. **Election-Ready:** Serverless architecture for October 2026 traffic spikes
4. **Transparency:** Open methodology for bias classification
5. **Data-Lite Mode:** Optimized for prepaid mobile plans (45% of market)

---

## 4. Political Spectrum Framework

### Multi-Dimensional Classification System

#### Dimension 1: Economic Axis (X-Axis)
- **Market-Driven** (+5): Privatization, fiscal austerity, free trade
  - *Example Sources:* Revista Oeste, O Antagonista
- **State-Driven** (-5): Social programs, state intervention, protectionism
  - *Example Sources:* Brasil 247, Revista Fórum

#### Dimension 2: Social Axis (Y-Axis)
- **Progressive** (+5): LGBTQ+ rights, secularism, environmental policy
  - *Example Sources:* The Intercept Brasil, Carta Capital
- **Conservative** (-5): Religious values, traditional family, law & order
  - *Example Sources:* Gazeta do Povo, Jovem Pan

#### Dimension 3: Institutionalism (Z-Axis / Overlay)
- **Pro-Establishment** (+5): Respect for judiciary, democratic norms
  - *Example Sources:* Folha, Estadão, Globo
- **Anti-System** (-5): Criticism of STF, "Old Guard" politicians
  - *Example Sources:* Both far-left and far-right outlets

#### Visual Representation
```
         Progressive (+5)
              |
              |
State ←------+------→ Market
 (-5)        |        (+5)
              |
         Conservative (-5)

Color Overlay: 
🟢 Green = Pro-Establishment
🔴 Red = Anti-System
```

### Polarization Index (Article-Level)
- **Score Range:** 0-100
- **Calculation:** NLP analysis of:
  - Loaded adjectives (e.g., "desastroso," "golpista," "corrupto")
  - Emotional language density
  - Use of absolutes ("sempre," "nunca," "todos")
  - Absence of opposing viewpoints
- **Display:** 
  - 0-30: Low polarization (factual)
  - 31-70: Moderate bias
  - 71-100: High polarization (opinion/editorial)

---

## 5. Feature Specification

### 5.1 MVP Features (Launch - March 2026)

#### Feature 1: The Comparison Slider
**Description:** Core UI element showing the same story from 3 perspectives

**User Flow:**
1. User opens app to homepage showing top 5 breaking stories
2. Taps a story card (e.g., "STF Rules on Bolsonaro Eligibility")
3. Sees horizontal slider with 3 article cards:
   - **Left Panel:** Brasil 247 headline + 2-sentence snippet + bias score
   - **Center Panel:** Folha headline + snippet + bias score
   - **Right Panel:** Jovem Pan headline + snippet + bias score
4. Can swipe left/right to navigate between perspectives
5. Tap "Read Full Article" redirects to original source

**Technical Requirements:**
- Lazy loading for smooth swipes
- Cached images for offline viewing
- Deep linking to specific story comparisons

**Design Mockup Reference:**
```
┌─────────────────────────────────┐
│ ← Brasil 247 (Left) →           │
│ "STF Defende Democracia..."     │
│ [Snippet text...]               │
│ 📊 Polarization: 68/100         │
│ 🔗 Read Full Article            │
└─────────────────────────────────┘
     Swipe indicators: ●○○
```

#### Feature 2: Blindspot Detector
**Description:** Shows what stories YOUR side isn't covering today

**Logic:**
- App tracks which bias category user reads most (implicit preference)
- Identifies top 10 stories being covered by opposite bias sources but NOT by user's preferred sources
- Displays as separate feed: "What You're Missing Today"

**Example:**
- User reads mostly center-left sources
- App shows: "5 stories trending on right-wing outlets but absent from your usual sources"

#### Feature 3: Data-Lite Mode
**Description:** Extreme compression for prepaid mobile users

**Technical Implementation:**
- Strip all images (text-only view)
- Reduce API calls (cache aggressively for 1 hour)
- Compress JSON responses with gzip
- Target: <500KB total data per session
- Auto-enable when app detects 2G/3G connection

#### Feature 4: WhatsApp Bot Integration
**Description:** Users forward suspicious links to a WhatsApp number and receive bias rating

**Flow:**
1. User receives viral article link in family WhatsApp group
2. Forwards link to @EspectroBot (+55 11 9xxxx-xxxx)
3. Bot scrapes article, runs bias analysis
4. Returns within 10 seconds:
   ```
   🔍 Espectro Analysis:
   Source: Brasil 247 (Left-Leaning)
   Polarization: 72/100 (High)
   
   See other perspectives: 
   [App Deep Link]
   ```

**Privacy:** No message content stored, only URL analyzed

#### Feature 5: Source Directory
**Description:** Browse all 50+ sources with transparency cards

**Each Source Profile Includes:**
- Bias coordinates (X, Y, Z scores)
- Ownership information (media conglomerate, independent, etc.)
- Funding sources (advertising, subscriptions, sponsors)
- Methodology note: "Classified by expert panel + AI validation"
- Historical bias drift chart (has source moved left/right over time?)

### 5.2 Premium Features (Freemium Model)

#### Premium Tier ($4.99/month or R$25/month)
- **Ad-Free Experience**
- **Political Intelligence Dashboard:**
  - Heatmap showing which topics each bias is amplifying today
  - Keyword tracking (e.g., alert when "Lula" + "corruption" trending)
  - Export comparison reports (PDF for presentations)
- **Advanced Filters:**
  - Filter by region (South vs Northeast coverage)
  - Filter by media type (TV, print, digital-native)
- **Historical Archive:** Access stories older than 30 days (free tier limited to current month)

### 5.3 Post-MVP Roadmap (Q3-Q4 2026)

**Phase 2 Features:**
- **Community Jury:** Users can challenge bias ratings (with justification)
- **Browser Extension:** Adds bias badge to articles on any website
- **Fact-Check Integration:** Partner with Aos Fatos or Lupa for disputed claims
- **Podcast Transcription:** Expand to Jovem Pan radio shows, Flow Podcast

---

## 6. Technical Architecture

### 6.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Mobile App   │  │ Web App      │  │ WhatsApp Bot │      │
│  │ (Flutter)    │  │ (Next.js)    │  │ (Twilio API) │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│              (AWS API Gateway / CloudFront CDN)              │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Auth       │  │  Content    │  │  Analytics  │
│  Service    │  │  Service    │  │  Service    │
│ (Supabase)  │  │ (Lambda)    │  │ (Lambda)    │
└─────────────┘  └──────┬──────┘  └─────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Article    │  │  Bias       │  │  User       │
│  Database   │  │  Database   │  │  Database   │
│ (PostgreSQL)│  │ (PostgreSQL)│  │ (Supabase)  │
└─────────────┘  └─────────────┘  └─────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  RSS        │  │  Web        │  │  AI Bias    │
│  Aggregator │  │  Scrapers   │  │  Analyzer   │
│  (Cron)     │  │  (Scrapy)   │  │  (OpenAI)   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### 6.2 Technology Stack

#### Frontend
- **Mobile:** Flutter (single codebase for iOS + Android)
  - **Rationale:** Cross-platform, excellent performance, strong offline support
  - **Key Packages:** 
    - `http` for API calls
    - `cached_network_image` for image optimization
    - `flutter_secure_storage` for token management
- **Web:** Next.js 14 (React framework)
  - **Rationale:** SEO-friendly, server-side rendering for social sharing
  - **Key Libraries:**
    - Tailwind CSS for styling
    - SWR for data fetching/caching
    - NextAuth for authentication

#### Backend
- **API Layer:** AWS Lambda + API Gateway (Serverless)
  - **Language:** Node.js (TypeScript)
  - **Rationale:** Auto-scales for election traffic spikes, pay-per-use pricing
- **Database:** 
  - **Primary:** Supabase (managed PostgreSQL)
    - **Rationale:** Built-in auth, realtime subscriptions, LGPD-compliant EU hosting option
  - **Cache:** Redis (ElastiCache) for hot article data
- **Storage:** AWS S3 for article snapshots and images

#### Data Pipeline
- **News Aggregation:**
  - **RSS Feeds:** Python script (Feedparser library) running on AWS Lambda scheduled every 15 minutes
  - **Web Scrapers:** Scrapy cluster for sites without RSS
    - **Anti-Bot Measures:** Rotating proxies (ScraperAPI), user-agent spoofing
  - **Job Queue:** AWS SQS for scraping task distribution
- **AI Bias Analysis:**
  - **Model:** GPT-4 Turbo (OpenAI API)
  - **Fallback:** Gemini 1.5 (Google) if OpenAI rate-limited
  - **Prompt Engineering:** Few-shot learning with 20 manually labeled Brazilian articles
  - **Cost Optimization:** Batch processing, cache results for 24 hours

#### Infrastructure
- **Hosting:** AWS (São Paulo region `sa-east-1` for low latency)
- **CDN:** CloudFront for static assets
- **Monitoring:** 
  - Sentry for error tracking
  - Grafana + Prometheus for performance metrics
- **CI/CD:** GitHub Actions for automated testing + deployment

#### WhatsApp Bot
- **Platform:** Twilio API for WhatsApp Business
- **Processing:** AWS Lambda function triggered by incoming message webhook
- **Response Time SLA:** <10 seconds for bias analysis

### 6.3 Data Models

#### Source Schema
```sql
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  
  -- Bias Coordinates
  economic_score SMALLINT CHECK (economic_score BETWEEN -5 AND 5),  -- Market vs State
  social_score SMALLINT CHECK (social_score BETWEEN -5 AND 5),      -- Progressive vs Conservative
  institutional_score SMALLINT CHECK (institutional_score BETWEEN -5 AND 5), -- Establishment vs Anti-System
  
  -- Metadata
  media_type VARCHAR(50), -- 'newspaper', 'tv', 'digital-native', 'radio'
  region VARCHAR(50),     -- 'national', 'south', 'northeast', etc.
  ownership TEXT,         -- e.g., "Grupo Globo", "Independent"
  funding_model TEXT,     -- e.g., "Advertising + Subscription"
  
  -- Aggregation Config
  rss_feed_url TEXT,
  scraper_config JSONB,   -- Custom scraper rules if needed
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_scraped_at TIMESTAMP
);

CREATE INDEX idx_sources_bias ON sources (economic_score, social_score);
```

#### Article Schema
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  snippet TEXT,           -- 2-sentence summary (max 280 chars)
  full_text TEXT,         -- Only for analysis, not displayed
  url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  
  -- Classification
  polarization_score SMALLINT CHECK (polarization_score BETWEEN 0 AND 100),
  primary_topic VARCHAR(100), -- e.g., 'politics', 'economy', 'judiciary'
  keywords TEXT[],        -- Array of extracted keywords
  
  -- Clustering (for Comparison Slider)
  story_cluster_id UUID,  -- Groups articles covering same event
  
  -- Metadata
  published_at TIMESTAMP,
  scraped_at TIMESTAMP DEFAULT NOW(),
  is_breaking BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_cluster ON articles (story_cluster_id, published_at DESC);
CREATE INDEX idx_articles_topic ON articles (primary_topic, published_at DESC);
CREATE INDEX idx_articles_breaking ON articles (is_breaking, published_at DESC) WHERE is_breaking = TRUE;
```

#### Story Cluster Schema
```sql
CREATE TABLE story_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Cluster Metadata
  title TEXT NOT NULL,               -- Normalized headline (e.g., "STF Decision on Bolsonaro Eligibility")
  description TEXT,                  -- Brief summary of event
  primary_topic VARCHAR(100),
  
  -- Representative Articles (for quick access)
  left_article_id UUID REFERENCES articles(id),
  center_article_id UUID REFERENCES articles(id),
  right_article_id UUID REFERENCES articles(id),
  
  -- Metrics
  total_articles INTEGER DEFAULT 0,
  bias_coverage_map JSONB,          -- {"left": 5, "center": 8, "right": 12}
  
  -- Timestamps
  first_seen_at TIMESTAMP DEFAULT NOW(),
  last_updated_at TIMESTAMP DEFAULT NOW(),
  is_trending BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_clusters_trending ON story_clusters (is_trending, last_updated_at DESC);
```

#### User Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Auth (Handled by Supabase Auth)
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),                 -- For WhatsApp bot linking
  
  -- Profile
  display_name VARCHAR(100),
  
  -- Preferences
  implicit_bias_preference VARCHAR(20), -- 'left', 'center', 'right', 'unknown'
  data_lite_mode BOOLEAN DEFAULT FALSE,
  notification_settings JSONB,       -- Push notification preferences
  
  -- Subscription
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'premium'
  subscription_expires_at TIMESTAMP,
  
  -- Privacy (LGPD Compliance)
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  data_retention_days INTEGER DEFAULT 365,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);
```

#### User Activity Schema (Encrypted for LGPD)
```sql
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activity
  article_id UUID REFERENCES articles(id),
  action_type VARCHAR(50),           -- 'view', 'share', 'bookmark', 'compare'
  
  -- Context
  referrer TEXT,                     -- 'homepage', 'blindspot', 'search', 'whatsapp_bot'
  device_type VARCHAR(50),           -- 'mobile', 'web'
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partition by month for LGPD data retention compliance
CREATE INDEX idx_activity_user_date ON user_activity (user_id, created_at DESC);
```

#### WhatsApp Bot Log Schema
```sql
CREATE TABLE whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Request
  phone_number VARCHAR(20),          -- Anonymized after 30 days
  url_analyzed TEXT NOT NULL,
  
  -- Response
  source_detected_id UUID REFERENCES sources(id),
  bias_scores JSONB,                 -- {economic: 3, social: -2, institutional: 4}
  polarization_score SMALLINT,
  
  -- Performance
  processing_time_ms INTEGER,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Auto-delete after 30 days for privacy
CREATE INDEX idx_bot_logs_cleanup ON whatsapp_bot_logs (created_at);
```

### 6.4 API Endpoints

#### Public Endpoints (No Auth Required)

```
GET /api/v1/stories/trending
Response: Top 10 trending story clusters with left/center/right articles

GET /api/v1/stories/:cluster_id
Response: Detailed cluster with all articles and bias breakdown

GET /api/v1/sources
Response: List of all sources with bias coordinates

GET /api/v1/sources/:source_id
Response: Detailed source profile with transparency data
```

#### Authenticated Endpoints

```
GET /api/v1/feed/personalized
Headers: Authorization: Bearer <token>
Response: Personalized feed based on implicit bias preference

GET /api/v1/blindspot
Headers: Authorization: Bearer <token>
Response: Stories NOT covered by user's preferred bias

POST /api/v1/articles/:id/bookmark
Headers: Authorization: Bearer <token>
Response: Success/failure

GET /api/v1/analytics/dashboard (Premium Only)
Headers: Authorization: Bearer <token>
Response: Political intelligence dashboard data
```

#### WhatsApp Bot Webhook

```
POST /api/v1/whatsapp/analyze
Body: { "from": "+5511999999999", "url": "https://..." }
Response: { "source": "...", "bias": {...}, "polarization": 72, "app_link": "..." }
```

### 6.5 Bias Analysis Pipeline

#### Step 1: Article Ingestion
```python
# Pseudo-code for RSS aggregation
def fetch_articles():
    for source in get_all_sources():
        if source.rss_feed_url:
            feed = parse_rss(source.rss_feed_url)
            for entry in feed.entries:
                if not article_exists(entry.link):
                    queue_for_analysis(entry)
```

#### Step 2: AI Bias Scoring
```python
# OpenAI GPT-4 Prompt Template
BIAS_ANALYSIS_PROMPT = """
You are analyzing a Brazilian news article for political bias.

Article:
Title: {title}
Text: {text}
Source: {source_name}

Task: Provide a JSON response with:
1. "polarization_score" (0-100): How emotionally charged is the language?
2. "keywords": List of 5 key terms
3. "reasoning": Brief explanation of your scoring

Examples:
- High polarization (70+): "golpe", "ditadura", "fascista", "comunista"
- Low polarization (0-30): Factual reporting, multiple sources cited

Respond in JSON format only.
"""

def analyze_bias(article):
    response = openai.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a Brazilian media bias analyst."},
            {"role": "user", "content": BIAS_ANALYSIS_PROMPT.format(**article)}
        ],
        temperature=0.3  # Lower temperature for consistency
    )
    return json.loads(response.choices[0].message.content)
```

#### Step 3: Story Clustering
```python
# Vector similarity using embeddings
def cluster_stories(new_article):
    embedding = get_embedding(new_article.title + new_article.snippet)
    
    # Find similar articles from last 24 hours
    recent_articles = get_articles_since(hours=24)
    for article in recent_articles:
        similarity = cosine_similarity(embedding, article.embedding)
        if similarity > 0.85:  # High similarity threshold
            add_to_cluster(article.cluster_id, new_article)
            return
    
    # No match found, create new cluster
    create_new_cluster(new_article)
```

### 6.6 Performance Optimization

#### Caching Strategy
- **Article Lists:** Redis cache for 5 minutes (TTL)
- **Source Profiles:** Redis cache for 24 hours
- **Story Clusters:** Redis cache for 15 minutes (refresh during breaking news)
- **User Feed:** No cache (personalized)

#### Database Query Optimization
```sql
-- Materialized view for trending stories (refreshed every 5 min)
CREATE MATERIALIZED VIEW trending_stories AS
SELECT 
  sc.id,
  sc.title,
  sc.last_updated_at,
  COUNT(DISTINCT a.id) as article_count,
  SUM(a.view_count) as total_views
FROM story_clusters sc
JOIN articles a ON a.story_cluster_id = sc.id
WHERE a.published_at > NOW() - INTERVAL '24 hours'
GROUP BY sc.id
ORDER BY total_views DESC
LIMIT 10;

CREATE UNIQUE INDEX ON trending_stories (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY trending_stories;
```

#### Image Optimization
- **CDN:** CloudFront for article images
- **Compression:** WebP format (fallback to JPEG for old devices)
- **Lazy Loading:** Images load as user scrolls
- **Data-Lite Mode:** No images, text-only

#### Election Day Scaling Plan
- **Pre-Scale:** Increase Lambda concurrent executions from 100 to 1,000
- **Database:** Read replicas for PostgreSQL (3 additional instances)
- **CDN:** Pre-warm cache with top 100 articles
- **Monitoring:** Real-time alerts if API latency > 500ms

---

## 7. Legal & Compliance

### 7.1 LGPD Compliance (Lei Geral de Proteção de Dados)

#### Sensitive Data Handling
**Article 5, II:** Political opinions are "dados pessoais sensíveis"

**Implementation:**
- User reading preferences (left/center/right) stored with AES-256 encryption
- Database column-level encryption for `implicit_bias_preference`
- Auto-deletion of granular activity logs after 90 days (aggregate stats retained)

#### User Rights
- **Right to Access:** Export all user data via Settings → "Download My Data"
- **Right to Deletion:** Permanent account deletion within 48 hours
- **Right to Portability:** JSON export of bookmarks, preferences
- **Consent Management:** Explicit opt-in during onboarding

#### Data Retention Policy
```sql
-- Automated cleanup job (runs daily)
DELETE FROM user_activity 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Anonymize WhatsApp bot logs after 30 days
UPDATE whatsapp_bot_logs
SET phone_number = 'ANONYMIZED'
WHERE created_at < NOW() - INTERVAL '30 days';
```

### 7.2 Copyright & Fair Use

#### Article Display Rules
- **Headline:** Display verbatim (titles not copyrightable in Brazil)
- **Snippet:** Maximum 280 characters (2 sentences)
- **Image:** Thumbnail only (<200px width), with watermark
- **Full Text:** NEVER display; always link to original source

#### Legal Justification
- **Brazilian Copyright Law (Lei 9.610/98), Article 46, I:** 
  - Citation of excerpts is permitted for "study, criticism, or news reporting"
- **Precedent:** Google News Brasil operates under similar framework

#### Risk Mitigation
- Display prominent "Read Full Article" button
- Track click-through rate (aim for >40% to demonstrate we drive traffic)
- Proactive outreach to major outlets explaining value proposition
- DMCA-style takedown system (remove article within 24 hours if requested)

### 7.3 Defamation Risk

**Scenario:** News outlet sues over bias classification (e.g., "You called us far-right!")

**Protection Strategy:**
1. **Opinion Defense:** Bias ratings are editorial opinion, protected speech
2. **Transparency:** Publish full methodology on website
3. **Corrections Policy:** Allow sources to submit rebuttals displayed on their profile
4. **Insurance:** Media liability insurance (estimate R$5,000/year)

### 7.4 Terms of Service Key Clauses

```markdown
## User Obligations
- Do not attempt to manipulate bias ratings through fake accounts
- Do not scrape or automate access to the platform
- Reporting misinformation is encouraged, but false reports may result in suspension

## Disclaimer
Espectro provides bias ratings as editorial analysis, not factual determinations. 
Users should read original sources to form independent judgments.

## Governing Law
Disputes governed by Brazilian law, jurisdiction in São Paulo.
```

---

## 8. Go-To-Market Strategy

### 8.1 Pre-Launch (January - February 2026)

#### Validation Campaign
- **Landing Page:** Build with Webflow, collect 5,000 email waitlist signups
- **Beta Testing:** Recruit 100 beta testers via Twitter/Reddit Brasil
  - Target: University students, journalists, political science professors
- **Influencer Outreach:** 
  - Podcast appearances: Mamilos, Rádio Novelo
  - YouTube creators: Meteoro Brasil, Manual do Mundo (if politics-adjacent content)

#### Manual Content Curation
- Classify all 50+ sources with expert panel (3 political scientists + you)
- Curate 100 historical story clusters (2022 election, STF decisions, etc.) as training data
- Test AI bias scoring accuracy vs. manual labels (target >85% agreement)

### 8.2 Soft Launch (March 2026)

#### Channels
- **Product Hunt:** Launch with "News aggregator for Brazil's polarized media" pitch
- **Twitter/X:** Thread explaining methodology with visual bias map
- **Press Release:** Distribute to Folha, Estadão, The Intercept Brasil
  - Angle: "Startup fights fake news with transparency, not censorship"

#### Success Metrics
- 10,000 app downloads in Week 1
- 50+ articles written about Espectro
- <5% crash rate (monitor with Sentry)

### 8.3 Growth Tactics (April - September 2026)

#### Viral Mechanics
- **Shareable Graphics:** Auto-generate Instagram stories comparing how different outlets covered a story
  - Example: "Globo vs. Jovem Pan on today's inflation data"
- **WhatsApp Bot Virality:** Incentivize referrals (e.g., "Invite 3 friends to bot, get 1 month free premium")

#### Partnerships
- **Universities:** Offer free premium accounts to journalism students
- **Fact-Checkers:** Co-branding with Aos Fatos (they verify claims, we show bias)
- **Podcasters:** Provide API access for live "bias check" segments during shows

#### Content Marketing
- Weekly blog: "Bias of the Week" analyzing how one story was covered
- Monthly report: "Which topics are ignored by which bias?" (data journalism)

### 8.4 Election Surge (October 2026)

#### Paid Advertising (Budget: R$50,000)
- **Google Search Ads:** Target keywords like "eleições 2026," "notícias políticas"
- **Facebook/Instagram:** Video ads showing comparison slider in action
- **YouTube Pre-Roll:** Target viewers of political commentary channels

#### PR Blitz
- **TV Appearances:** Pitch founder story to Globo News, CNN Brasil
- **Op-Eds:** Write for major outlets about media literacy crisis

#### Operational Readiness
- **Scale Testing:** Simulate 100,000 concurrent users
- **War Room:** 24/7 monitoring during debate nights
- **Support Team:** Hire 3 part-time customer support reps (reply to WhatsApp bot issues)

### 8.5 Post-Election (November 2026+)

#### Retention Strategy
- Pivot messaging from "election coverage" to "everyday media literacy"
- Introduce local news coverage (state-level bias tracking)
- Expand to Argentina/Colombia (Spanish version)

---

## 9. Business Model & Financial Projections

### 9.1 Revenue Streams

#### Primary: Freemium Subscription
- **Free Tier:** 
  - Access to trending stories
  - Comparison slider for top 10 daily stories
  - WhatsApp bot (10 queries/day limit)
- **Premium Tier (R$25/month or R$240/year):**
  - Unlimited access
  - Political Intelligence dashboard
  - Ad-free experience
  - Historical archive
  - **Conversion Target:** 3% of active users

#### Secondary: B2B Licensing
- **Media Monitoring Agencies:** API access for R$2,000/month
- **Political Campaigns:** Custom dashboards during election season (R$10,000 one-time)
- **Universities:** Institutional licenses for research (R$5,000/year)

#### Tertiary: Affiliate Revenue
- **Fact-Checking:** If user reports a claim, earn affiliate fee from fact-checker's ad revenue
- **News Subscriptions:** Refer users to original sources (e.g., Folha+ subscription)

### 9.2 Cost Structure (Monthly, Steady-State)

| Category | Estimated Cost (R$) |
|----------|---------------------|
| **Infrastructure** | |
| AWS (compute, storage, CDN) | 3,000 |
| Supabase (database, auth) | 500 |
| OpenAI API (bias analysis) | 2,000 |
| Twilio (WhatsApp bot) | 800 |
| **Personnel** (Solo founder, Year 1) | |
| Freelance designers (10h/month) | 1,500 |
| Customer support (part-time) | 2,000 |
| **Marketing** | |
| Paid ads (avg, excl. election spike) | 5,000 |
| Content creation (blog, videos) | 1,000 |
| **Legal & Admin** | |
| Legal counsel (retainer) | 1,000 |
| Insurance (liability) | 400 |
| **Total Monthly** | **~R$17,200** |

**Annual Cost:** ~R$206,000 (~$41,000 USD)

### 9.3 Revenue Projections (Year 1)

| Metric | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 (Election) |
|--------|---------|---------|---------|---------------------|
| **Total Users** | 10,000 | 30,000 | 60,000 | 150,000 |
| **Premium Subscribers** (3% conversion) | 300 | 900 | 1,800 | 4,500 |
| **Subscription Revenue** (R$25/mo) | 7,500 | 22,500 | 45,000 | 112,500 |
| **B2B Licensing** | 0 | 4,000 | 8,000 | 20,000 |
| **Total Revenue** | 7,500 | 26,500 | 53,000 | 132,500 |

**Year 1 Total Revenue:** R$219,500 (~$44,000 USD)

### 9.4 Break-Even Analysis

- **Monthly costs:** R$17,200
- **Break-even premium subscribers:** 688 (at R$25/month)
- **Break-even total users:** 22,933 (assuming 3% conversion)

**Expected break-even:** Q3 2026 (June-July)

### 9.5 Funding Strategy

#### Bootstrap Phase (Now - March 2026)
- Invest R$20,000 personal savings for development + initial marketing
- Minimize costs: solo development, free-tier tools

#### Seed Round (Target: April 2026, after soft launch traction)
- **Amount:** R$500,000 (~$100k USD)
- **Valuation:** R$2-3 million pre-money
- **Investors:** 
  - Brazilian angel investors in media/tech space
  - Accelerators: Startup Farm, ACE, Dínamo
  - International: consider Y Combinator (Brazilian founder, global ambitions)

#### Use of Funds
- 40% Engineering (hire 1 full-time developer)
- 30% Marketing (scale user acquisition)
- 20% Operations (customer support, legal)
- 10% Runway buffer

---

## 10. Risk Assessment & Mitigation

### 10.1 Technical Risks

#### Risk 1: AI Bias Scoring Inaccuracy
**Probability:** Medium  
**Impact:** High (undermines credibility)

**Mitigation:**
- Human-in-the-loop validation (audit 10% of scores weekly)
- Publish error rate transparently
- Allow community challenges to scores
- Use ensemble model (GPT-4 + Gemini, average scores)

#### Risk 2: Source Blocking (Anti-Scraping)
**Probability:** Medium  
**Impact:** High (lose content)

**Mitigation:**
- Prioritize sources with official APIs/RSS
- Rotate proxies, respect robots.txt
- Build partnerships for direct feeds
- Manual fallback for critical sources

#### Risk 3: Election Day Traffic Spike
**Probability:** High  
**Impact:** Critical (downtime = loss of credibility)

**Mitigation:**
- Load testing with 10x expected traffic (1M concurrent users)
- Auto-scaling AWS Lambda (no cap on concurrency)
- CDN pre-warming
- Graceful degradation (if DB slow, serve cached homepage)

### 10.2 Business Risks

#### Risk 4: Low User Adoption
**Probability:** Medium  
**Impact:** Critical (no business without users)

**Mitigation:**
- Pre-launch waitlist (validate demand)
- Beta testing with target users
- Pivot messaging if needed (e.g., focus on students vs. general public)

#### Risk 5: Lawsuit from News Outlet
**Probability:** Low  
**Impact:** High (legal costs, reputational damage)

**Mitigation:**
- Legal review of all source profiles before publishing
- Takedown mechanism for disputed ratings
- Media liability insurance
- Proactive relationship-building with major outlets

#### Risk 6: Competitor Launch
**Probability:** Low (no known competitors)  
**Impact:** Medium (first-mover advantage lost)

**Mitigation:**
- Speed to market (MVP in 3 months)
- Network effects (more users = better clustering)
- Transparency moat (hard to replicate credible bias methodology)

### 10.3 Ethical Risks

#### Risk 7: "Both-Sides-ism" Criticism
**Concern:** Legitimizing fringe outlets by giving them equal weight

**Mitigation:**
- Include "reliability score" separate from bias (e.g., fact-checking track record)
- Don't amplify known misinformation sources
- Editorial policy: exclude outlets that systematically publish false info

#### Risk 8: Being Labeled "Biased" Ourselves
**Concern:** Users on both extremes accuse platform of bias

**Mitigation:**
- Publish full methodology transparently
- Independent advisory board (left + right + center academics)
- Regular audits by third-party media researchers
- Welcome criticism, update methodology based on feedback

---

## 11. Success Metrics (KPIs)

### 11.1 Product Metrics

| Metric | Target (6 months) | Measurement Method |
|--------|-------------------|-------------------|
| **Daily Active Users (DAU)** | 20,000 | App analytics |
| **Retention (Day 7)** | 40% | Cohort analysis |
| **Comparison Slider Usage** | 60% of sessions | Event tracking |
| **WhatsApp Bot Engagement** | 5,000 queries/day | Twilio logs |
| **Avg Session Duration** | 4 minutes | Analytics |

### 11.2 Business Metrics

| Metric | Target (Year 1) | Measurement Method |
|--------|-----------------|-------------------|
| **Total Users** | 150,000 | Database count |
| **Premium Conversion** | 3% | Subscription data |
| **Monthly Recurring Revenue (MRR)** | R$112,500 | Stripe dashboard |
| **Customer Acquisition Cost (CAC)** | <R$15 | Marketing spend / new users |
| **Lifetime Value (LTV)** | >R$100 | Avg subscription duration x R$25 |

### 11.3 Impact Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| **"Blindspot" Click-Through** | 20% | Users clicking stories from opposite bias |
| **Cross-Bias Reading** | 35% | Users viewing left+center+right on same story |
| **User Survey: "App changed my perspective"** | 60% agree | Quarterly survey |
| **Media Coverage** | 50+ articles | Manual tracking |

---

## 12. Development Roadmap

### Phase 0: Foundation (Weeks 1-2)
- [ ] Set up GitHub repository
- [ ] Configure AWS account + Supabase project
- [ ] Create database schema (run migrations)
- [ ] Build basic Flutter app scaffold
- [ ] Implement Next.js web app skeleton
- [ ] Set up CI/CD pipeline (GitHub Actions)

### Phase 1: Data Pipeline (Weeks 3-5)
- [ ] Build RSS aggregator (Python script)
- [ ] Develop 10 custom scrapers for non-RSS sources
- [ ] Implement OpenAI bias analysis integration
- [ ] Create story clustering algorithm
- [ ] Test with 30-day historical data

### Phase 2: Core Features (Weeks 6-9)
- [ ] Comparison Slider UI (mobile + web)
- [ ] Source Directory with bias maps
- [ ] Blindspot Detector algorithm
- [ ] Data-Lite Mode toggle
- [ ] User authentication (Supabase Auth)

### Phase 3: WhatsApp Integration (Week 10)
- [ ] Set up Twilio WhatsApp Business account
- [ ] Build Lambda webhook for bot
- [ ] Test with 20 beta users
- [ ] Optimize response time (<10s)

### Phase 4: Premium Features (Weeks 11-12)
- [ ] Political Intelligence dashboard
- [ ] Stripe payment integration
- [ ] Advanced filtering (region, media type)
- [ ] Historical archive access

### Phase 5: Testing & Polish (Weeks 13-14)
- [ ] Load testing (simulate 100k users)
- [ ] Security audit (LGPD compliance check)
- [ ] User acceptance testing (UAT) with 50 beta testers
- [ ] Fix critical bugs, polish UI

### Phase 6: Launch Preparation (Week 15)
- [ ] Finalize Terms of Service + Privacy Policy
- [ ] Set up monitoring (Sentry, Grafana)
- [ ] Create onboarding tutorial
- [ ] Prepare launch marketing materials
- [ ] Submit app to App Store/Google Play

### Phase 7: Soft Launch (Week 16 - March 2026)
- [ ] Release to waitlist subscribers
- [ ] Monitor performance and user feedback
- [ ] Iterate based on first 1,000 users
- [ ] Begin paid marketing campaigns

---

## 13. Open Questions & Decisions Needed

### Technical Decisions
1. **Mobile Framework:** Flutter vs React Native? (Leaning Flutter for performance)
2. **Hosting:** Stay with AWS or consider Google Cloud (for Gemini integration)?
3. **Database:** Supabase vs self-managed PostgreSQL + Redis?

### Product Decisions
4. **Paywall:** Should free tier have ads, or purely limited features?
5. **Notifications:** Push notifications for breaking news? (Could be annoying vs. valuable)
6. **Gamification:** Add "bias exposure score" to encourage cross-reading? (Risk: making it a game vs. serious tool)

### Business Decisions
7. **Pricing:** R$25/month vs R$15/month (cheaper but need more volume)?
8. **B2B Focus:** Should we pivot to enterprise earlier if consumer adoption is slow?
9. **International Expansion:** Argentina/Colombia after Brazil, or focus on Brazil only?

### Ethical Decisions
10. **Source Exclusion:** Should we exclude known misinformation outlets entirely, or include with disclaimer?
11. **User Data:** Collect reading preferences for Blindspot, or avoid tracking for privacy?
12. **Monetization Ethics:** Is it okay to earn affiliate revenue from news subscriptions, or conflict of interest?

---

## 14. Appendices

### A. Initial Source List (50 Sources for MVP)

#### National - Establishment
1. G1 (Globo)
2. Folha de S.Paulo
3. O Estado de S. Paulo (Estadão)
4. O Globo
5. Veja
6. Valor Econômico

#### National - Center-Left
7. UOL
8. CartaCapital
9. El País Brasil
10. The Intercept Brasil
11. Brasil de Fato

#### National - Left
12. Brasil 247
13. Revista Fórum
14. Mídia Ninja
15. Diário do Centro do Mundo (DCM)

#### National - Center-Right
16. Gazeta do Povo
17. O Antagonista
18. Metrópoles
19. Poder360

#### National - Right
20. Revista Oeste
21. Jornal da Cidade Online
22. Brasil Sem Medo

#### TV/Radio
23. Jovem Pan (Radio/Online)
24. CNN Brasil
25. BandNews
26. SBT Notícias

#### Digital-Native
27. Nexo Jornal
28. Agência Pública
29. Aos Fatos (Fact-Checking)
30. Lupa (Fact-Checking)

#### Regional - South
31. Zero Hora (RS)
32. Diário Catarinense (SC)
33. Gazeta do Povo (PR) [Duplicate - see #16]

#### Regional - Northeast
34. Diário do Nordeste (CE)
35. Correio da Bahia (BA)
36. Jornal do Commercio (PE)

#### Regional - North/Center-West
37. A Crítica (AM)
38. Correio Braziliense (DF)

#### Specialized
39. Congresso em Foco (Politics)
40. InfoMoney (Economy)
41. Exame (Business)
42. Época Negócios (Business)

#### Opinion/Commentary
43. Crusoé
44. Piauí
45. Outras Palavras

#### Emerging/YouTube
46. Meteoro Brasil (YouTube)
47. Brasil Paralelo (Documentary/Right)
48. Canal MyNews (YouTube)

#### International with Brazil Coverage
49. BBC Brasil
50. Reuters Brasil

### B. Sample User Journey

**Persona:** Maria, 32, teacher in São Paulo, votes center-left but open-minded

**Scenario:** STF announces decision on Bolsonaro's political rights

1. **Trigger:** Maria sees headline in WhatsApp family group (no source cited)
2. **Action 1:** Opens Espectro app, sees "STF Decision" as #1 trending story
3. **Action 2:** Taps story card, lands on Comparison Slider
4. **Experience:**
   - Swipes left: Brasil 247 headline - "STF Defends Democracy Against Fascist Threat" (Polarization: 78)
   - Swipes center: Folha headline - "STF Bars Bolsonaro from 2026 Elections" (Polarization: 22)
   - Swipes right: Jovem Pan headline - "STF Political Persecution Continues" (Polarization: 71)
5. **Insight:** Maria realizes her usual source (center-left) is more measured than far-left, but right-wing sees this completely differently
6. **Action 3:** Taps "Read Full Article" on Folha (most neutral), clicks through
7. **Outcome:** Maria shares app with WhatsApp group: "Before arguing, let's see what all sides are saying"

### C. Glossary of Brazilian Political Terms (for AI Training)

| Term | Definition | Usage in Bias Analysis |
|------|------------|------------------------|
| **Bolsonarismo** | Political movement aligned with Jair Bolsonaro | Right-wing sources use positively; left-wing sources use pejoratively |
| **Petismo** | Political movement aligned with Workers' Party (PT) | Left-wing sources embrace; right-wing sources use as slur |
| **STF (Supremo Tribunal Federal)** | Brazilian Supreme Court | Center sources neutral; right accuses of overreach; left defends as democratic guardian |
| **Golpe** (Coup) | Used to describe 2016 Dilma impeachment or 2022 election denial | Highly polarizing term - signals strong bias |
| **Fake News** | Misinformation | All sides accuse each other; context matters |
| **Lava Jato** | Anti-corruption operation | Right-wing celebrates; left-wing views as political persecution |

### D. Contact Information for Partnerships

#### Fact-Checking Organizations
- **Aos Fatos:** contato@aosfatos.org
- **Lupa:** contato@lupa.news

#### University Media Research Centers
- **USP - School of Communications:** eca@usp.br
- **UFMG - Communication Department:** dir@fafich.ufmg.br

#### Journalism Associations
- **Fenaj (National Journalism Federation):** fenaj@fenaj.org.br
- **Abraji (Investigative Journalism Association):** abraji@abraji.org.br

---

## Document Control

**Version History:**
- v1.0 (2026-01-05): Initial specification based on founder interview

**Next Steps:**
1. Review spec with technical advisor (if available)
2. Validate AWS cost estimates with load calculator
3. Begin Phase 0 development (Week 1)

**Questions/Feedback:** [Founder email/contact]

---

**END OF SPECIFICATION**
