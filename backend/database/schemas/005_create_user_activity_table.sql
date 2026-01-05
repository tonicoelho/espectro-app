-- User Activity Table: Tracks user interactions for analytics
-- ENCRYPTED and auto-deleted after 90 days (LGPD compliance)
-- Based on spec.md Section 6.3 Data Models

CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Activity Details
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,  -- 'view', 'share', 'bookmark', 'compare', 'read_full'

  -- Context for Analytics
  referrer TEXT,                     -- 'homepage', 'blindspot', 'search', 'whatsapp_bot', 'notification'
  device_type VARCHAR(50),           -- 'mobile', 'web', 'whatsapp'
  session_id UUID,                   -- Group actions into sessions

  -- For Blindspot Detector Algorithm
  -- We track which bias sources user reads most
  source_bias_category VARCHAR(20),  -- 'left', 'center', 'right'

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partition by month for efficient cleanup (LGPD data retention)
-- This will be implemented via scheduled job, not table partitioning initially
CREATE INDEX idx_activity_user_date ON user_activity (user_id, created_at DESC);
CREATE INDEX idx_activity_cleanup ON user_activity (created_at);
CREATE INDEX idx_activity_action ON user_activity (action_type, created_at DESC);

-- Automated cleanup function (runs daily via cron/Lambda)
CREATE OR REPLACE FUNCTION cleanup_old_activity()
RETURNS void AS $$
BEGIN
  DELETE FROM user_activity
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Materialized view for user bias preference calculation
-- Refreshed hourly to update Blindspot Detector
CREATE MATERIALIZED VIEW user_bias_preferences AS
SELECT
  user_id,
  CASE
    WHEN AVG(CASE source_bias_category
      WHEN 'left' THEN -1
      WHEN 'center' THEN 0
      WHEN 'right' THEN 1
    END) < -0.3 THEN 'left'
    WHEN AVG(CASE source_bias_category
      WHEN 'left' THEN -1
      WHEN 'center' THEN 0
      WHEN 'right' THEN 1
    END) > 0.3 THEN 'right'
    ELSE 'center'
  END AS inferred_preference,
  COUNT(*) AS total_interactions,
  MAX(created_at) AS last_interaction
FROM user_activity
WHERE action_type = 'view'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id
HAVING COUNT(*) >= 5; -- Minimum 5 interactions to infer preference

CREATE UNIQUE INDEX ON user_bias_preferences (user_id);

-- Comments
COMMENT ON TABLE user_activity IS 'User interactions - auto-deleted after 90 days (LGPD Art. 16)';
COMMENT ON COLUMN user_activity.source_bias_category IS 'Used to calculate implicit bias preference for Blindspot Detector';
COMMENT ON FUNCTION cleanup_old_activity IS 'Scheduled daily cleanup for LGPD compliance';
