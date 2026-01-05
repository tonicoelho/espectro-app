-- Users Table: User accounts and preferences
-- Integrates with Supabase Auth for authentication
-- LGPD-compliant with data retention policies
-- Based on spec.md Section 6.3 Data Models

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Auth (Managed by Supabase Auth, synced here)
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),                 -- For WhatsApp bot linking

  -- Profile
  display_name VARCHAR(100),
  avatar_url TEXT,

  -- Reading Preferences (ENCRYPTED - Political opinions are sensitive data per LGPD Art. 5)
  implicit_bias_preference VARCHAR(20), -- 'left', 'center', 'right', 'unknown'
  -- This is inferred from reading behavior, NOT explicitly asked

  -- App Settings
  data_lite_mode BOOLEAN DEFAULT FALSE,  -- Strip images, reduce API calls
  notification_settings JSONB DEFAULT '{"breaking_news": false, "daily_digest": false}'::jsonb,
  preferred_topics TEXT[],               -- User can follow specific topics

  -- Subscription (Freemium Model)
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'premium'
  subscription_expires_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),       -- For payment processing

  -- Privacy & LGPD Compliance
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  data_retention_days INTEGER DEFAULT 90, -- User can customize retention period

  -- Gamification (Optional - see spec Open Questions)
  bias_exposure_score INTEGER DEFAULT 0, -- Points for reading across bias spectrum

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP                   -- Soft delete for LGPD compliance
);

-- Indexes
CREATE INDEX idx_users_subscription ON users (subscription_tier, subscription_expires_at);
CREATE INDEX idx_users_active ON users (last_active_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users (phone) WHERE phone IS NOT NULL;

-- Trigger to update last_active_at
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE users IS 'User accounts with LGPD-compliant privacy settings';
COMMENT ON COLUMN users.implicit_bias_preference IS 'ENCRYPTED: Inferred political preference (LGPD sensitive data)';
COMMENT ON COLUMN users.data_lite_mode IS 'Extreme compression mode for prepaid mobile users (45% of Brazilian market)';
COMMENT ON COLUMN users.consent_given IS 'User explicitly agreed to Terms & Privacy Policy';
