-- =====================================================
-- MIGRATION: Add OAuth Support to Users Table
-- Date: 2025-12-13
-- Description: Adds columns to support Google OAuth authentication
-- =====================================================

-- Add OAuth columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for faster OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_provider 
ON users(provider, provider_id);

-- Add comment to document the columns
COMMENT ON COLUMN users.provider IS 'OAuth provider (google, facebook, etc.)';
COMMENT ON COLUMN users.provider_id IS 'Unique ID from OAuth provider';
COMMENT ON COLUMN users.avatar_url IS 'Profile picture URL';

-- Verify the migration
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('provider', 'provider_id', 'avatar_url');
