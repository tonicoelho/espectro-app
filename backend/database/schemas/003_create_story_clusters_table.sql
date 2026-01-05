-- Story Clusters Table: Groups articles covering the same event
-- This powers the Comparison Slider feature
-- Based on spec.md Section 6.3 Data Models

CREATE TABLE story_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Cluster Metadata
  title TEXT NOT NULL,               -- Normalized headline (e.g., "STF Decision on Bolsonaro Eligibility")
  description TEXT,                  -- Brief summary of the event
  primary_topic VARCHAR(100),

  -- Representative Articles for Quick Access (Comparison Slider)
  -- These are the "canonical" articles shown in the 3-panel view
  left_article_id UUID REFERENCES articles(id),
  center_article_id UUID REFERENCES articles(id),
  right_article_id UUID REFERENCES articles(id),

  -- Coverage Metrics
  total_articles INTEGER DEFAULT 0,
  bias_coverage_map JSONB,          -- {"left": 5, "center": 8, "right": 12}

  -- Trending Calculation
  -- Score based on: recency + article count + view count
  trending_score DECIMAL(10, 2) DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,

  -- Timestamps
  first_seen_at TIMESTAMP DEFAULT NOW(),
  last_updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP              -- Auto-archive after 30 days (free tier limit)
);

-- Indexes
CREATE INDEX idx_clusters_trending ON story_clusters (is_trending, last_updated_at DESC);
CREATE INDEX idx_clusters_topic ON story_clusters (primary_topic, last_updated_at DESC);
CREATE INDEX idx_clusters_active ON story_clusters (last_updated_at DESC) WHERE expires_at > NOW();

-- Foreign key to link articles back to clusters
ALTER TABLE articles
ADD CONSTRAINT fk_articles_cluster
FOREIGN KEY (story_cluster_id) REFERENCES story_clusters(id) ON DELETE SET NULL;

-- Comments
COMMENT ON TABLE story_clusters IS 'Groups of articles covering the same news event from multiple perspectives';
COMMENT ON COLUMN story_clusters.left_article_id IS 'Representative article from left-leaning sources (economic_score < -2)';
COMMENT ON COLUMN story_clusters.center_article_id IS 'Representative article from centrist sources (economic_score between -2 and 2)';
COMMENT ON COLUMN story_clusters.right_article_id IS 'Representative article from right-leaning sources (economic_score > 2)';
COMMENT ON COLUMN story_clusters.trending_score IS 'Calculated score for homepage ranking';
