-- Materialized Views for Performance Optimization
-- Refreshed periodically to reduce query load
-- Based on spec.md Section 6.6 Performance Optimization

-- Trending Stories View (Refreshed every 5 minutes)
-- Powers the homepage "Top 10 Breaking Stories"
CREATE MATERIALIZED VIEW trending_stories AS
SELECT
  sc.id,
  sc.title,
  sc.description,
  sc.primary_topic,
  sc.left_article_id,
  sc.center_article_id,
  sc.right_article_id,
  sc.last_updated_at,
  COUNT(DISTINCT a.id) AS article_count,
  SUM(a.view_count) AS total_views,
  -- Trending score calculation:
  -- (recency_weight * time_factor) + (popularity_weight * view_factor)
  (
    (EXTRACT(EPOCH FROM NOW() - sc.last_updated_at) / 3600)::DECIMAL * -1 * 0.4 +
    SUM(a.view_count)::DECIMAL * 0.6
  ) AS trending_score
FROM story_clusters sc
JOIN articles a ON a.story_cluster_id = sc.id
WHERE a.published_at > NOW() - INTERVAL '48 hours' -- Only recent stories
  AND sc.is_trending = TRUE
GROUP BY sc.id
ORDER BY trending_score DESC
LIMIT 20;

CREATE UNIQUE INDEX ON trending_stories (id);
CREATE INDEX idx_trending_score ON trending_stories (trending_score DESC);

-- Source Statistics View (Refreshed every 24 hours)
-- Shows how active each source is
CREATE MATERIALIZED VIEW source_statistics AS
SELECT
  s.id,
  s.name,
  s.economic_score,
  s.social_score,
  s.institutional_score,
  COUNT(a.id) AS total_articles,
  COUNT(CASE WHEN a.published_at > NOW() - INTERVAL '7 days' THEN 1 END) AS articles_last_7_days,
  AVG(a.polarization_score)::DECIMAL(5,2) AS avg_polarization,
  MAX(a.published_at) AS last_article_published
FROM sources s
LEFT JOIN articles a ON a.source_id = s.id
WHERE s.is_active = TRUE
GROUP BY s.id;

CREATE UNIQUE INDEX ON source_statistics (id);

-- Blindspot Coverage Matrix (Refreshed every 1 hour)
-- Shows which stories are covered by which bias categories
CREATE MATERIALIZED VIEW blindspot_coverage AS
SELECT
  sc.id AS cluster_id,
  sc.title,
  sc.primary_topic,
  COUNT(CASE WHEN s.economic_score <= -2 THEN 1 END) AS left_coverage,
  COUNT(CASE WHEN s.economic_score BETWEEN -2 AND 2 THEN 1 END) AS center_coverage,
  COUNT(CASE WHEN s.economic_score >= 2 THEN 1 END) AS right_coverage,
  sc.last_updated_at
FROM story_clusters sc
JOIN articles a ON a.story_cluster_id = sc.id
JOIN sources s ON a.source_id = s.id
WHERE a.published_at > NOW() - INTERVAL '24 hours'
GROUP BY sc.id;

CREATE UNIQUE INDEX ON blindspot_coverage (cluster_id);
CREATE INDEX idx_blindspot_imbalance ON blindspot_coverage (
  (GREATEST(left_coverage, center_coverage, right_coverage) - LEAST(left_coverage, center_coverage, right_coverage)) DESC
);

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_stories;
  REFRESH MATERIALIZED VIEW CONCURRENTLY source_statistics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY blindspot_coverage;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_bias_preferences;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON MATERIALIZED VIEW trending_stories IS 'Top trending stories - refresh every 5 min via cron';
COMMENT ON MATERIALIZED VIEW source_statistics IS 'Source activity metrics - refresh daily';
COMMENT ON MATERIALIZED VIEW blindspot_coverage IS 'Coverage gaps by bias category - refresh hourly';
