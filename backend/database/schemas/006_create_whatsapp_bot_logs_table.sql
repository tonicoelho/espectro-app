-- WhatsApp Bot Logs: Tracks bias analysis requests via WhatsApp
-- Phone numbers anonymized after 30 days (LGPD privacy-first approach)
-- Based on spec.md Section 6.3 Data Models

CREATE TABLE whatsapp_bot_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Request Data
  phone_number VARCHAR(20),          -- Anonymized to 'ANONYMIZED' after 30 days
  url_analyzed TEXT NOT NULL,

  -- Response Data
  source_detected_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  bias_scores JSONB,                 -- {economic: 3, social: -2, institutional: 4}
  polarization_score SMALLINT,

  -- Performance Monitoring (SLA: <10 seconds)
  processing_time_ms INTEGER,
  ai_model_used VARCHAR(50),         -- 'gpt-4-turbo' or 'gemini-1.5'
  error_message TEXT,                -- If analysis failed

  -- User Linking (Optional)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bot_logs_cleanup ON whatsapp_bot_logs (created_at);
CREATE INDEX idx_bot_logs_performance ON whatsapp_bot_logs (processing_time_ms, created_at DESC);
CREATE INDEX idx_bot_logs_source ON whatsapp_bot_logs (source_detected_id, created_at DESC);

-- Automated anonymization function (runs daily)
CREATE OR REPLACE FUNCTION anonymize_whatsapp_logs()
RETURNS void AS $$
BEGIN
  UPDATE whatsapp_bot_logs
  SET phone_number = 'ANONYMIZED'
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND phone_number != 'ANONYMIZED';
END;
$$ LANGUAGE plpgsql;

-- Auto-delete after 90 days (beyond anonymization)
CREATE OR REPLACE FUNCTION cleanup_old_bot_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM whatsapp_bot_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE whatsapp_bot_logs IS 'WhatsApp bot usage - phone numbers anonymized after 30 days';
COMMENT ON COLUMN whatsapp_bot_logs.processing_time_ms IS 'SLA target: <10,000ms (10 seconds)';
COMMENT ON FUNCTION anonymize_whatsapp_logs IS 'Privacy-first: Remove PII after 30 days';
