-- Articles Table: Individual news articles with bias analysis
-- Based on spec.md Section 6.3 Data Models

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  snippet TEXT,           -- 2-sentence summary (max 280 chars for Twitter-like brevity)
  full_text TEXT,         -- For AI analysis only, not displayed to users
  url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  author VARCHAR(255),

  -- AI Bias Classification
  polarization_score SMALLINT CHECK (polarization_score BETWEEN 0 AND 100),
  polarization_reasoning TEXT, -- AI explanation of score
  primary_topic VARCHAR(100), -- e.g., 'politics', 'economy', 'judiciary', 'environment'
  keywords TEXT[],        -- Array of extracted keywords for clustering

  -- Story Clustering (for Comparison Slider)
  story_cluster_id UUID,  -- Groups articles covering same event (set later)

  -- Metadata
  published_at TIMESTAMP,
  scraped_at TIMESTAMP DEFAULT NOW(),
  is_breaking BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,

  -- Quality Flags
  is_fact_checked BOOLEAN DEFAULT FALSE,
  fact_check_url TEXT,    -- Link to Aos Fatos or Lupa verification

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_source ON articles (source_id, published_at DESC);
CREATE INDEX idx_articles_cluster ON articles (story_cluster_id, published_at DESC);
CREATE INDEX idx_articles_topic ON articles (primary_topic, published_at DESC);
CREATE INDEX idx_articles_breaking ON articles (is_breaking, published_at DESC) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_published ON articles (published_at DESC);
CREATE INDEX idx_articles_url ON articles (url);

-- Full-text search on title and snippet
CREATE INDEX idx_articles_search ON articles USING GIN (to_tsvector('portuguese', title || ' ' || COALESCE(snippet, '')));

-- Comments
COMMENT ON TABLE articles IS 'News articles with AI-powered polarization analysis';
COMMENT ON COLUMN articles.polarization_score IS '0-30: Low (factual), 31-70: Moderate, 71-100: High (opinion/editorial)';
COMMENT ON COLUMN articles.snippet IS 'Brief summary for cards (max 280 chars)';
COMMENT ON COLUMN articles.full_text IS 'Full article text for AI analysis - NEVER display to users (copyright)';
