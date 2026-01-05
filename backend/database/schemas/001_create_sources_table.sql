-- Sources Table: News outlets with bias classification
-- Based on spec.md Section 6.3 Data Models

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,

  -- Bias Coordinates (Multi-Dimensional Framework)
  economic_score SMALLINT CHECK (economic_score BETWEEN -5 AND 5),  -- Market vs State (-5 to +5)
  social_score SMALLINT CHECK (social_score BETWEEN -5 AND 5),      -- Progressive vs Conservative (-5 to +5)
  institutional_score SMALLINT CHECK (institutional_score BETWEEN -5 AND 5), -- Establishment vs Anti-System (-5 to +5)

  -- Metadata
  media_type VARCHAR(50), -- 'newspaper', 'tv', 'digital-native', 'radio'
  region VARCHAR(50),     -- 'national', 'south', 'northeast', 'north', 'center-west', 'southeast'
  ownership TEXT,         -- e.g., "Grupo Globo", "Independent"
  funding_model TEXT,     -- e.g., "Advertising + Subscription", "Sponsored"

  -- Aggregation Configuration
  rss_feed_url TEXT,
  scraper_config JSONB,   -- Custom scraper rules if RSS unavailable
  is_active BOOLEAN DEFAULT TRUE,

  -- Transparency Data
  classification_method TEXT, -- 'expert_panel', 'ai_validated', 'community_verified'
  last_reviewed_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_scraped_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sources_bias ON sources (economic_score, social_score);
CREATE INDEX idx_sources_active ON sources (is_active, last_scraped_at) WHERE is_active = TRUE;
CREATE INDEX idx_sources_media_type ON sources (media_type);
CREATE INDEX idx_sources_region ON sources (region);

-- Comments for documentation
COMMENT ON TABLE sources IS 'Brazilian news sources with multi-dimensional bias classification';
COMMENT ON COLUMN sources.economic_score IS 'Economic axis: -5 (State-Driven) to +5 (Market-Driven)';
COMMENT ON COLUMN sources.social_score IS 'Social axis: -5 (Conservative) to +5 (Progressive)';
COMMENT ON COLUMN sources.institutional_score IS 'Z-axis: -5 (Anti-System) to +5 (Pro-Establishment)';
