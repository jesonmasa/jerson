/**
 * Supabase Client Configuration
 * Replaces the file-based multi-tenant database with Supabase PostgreSQL
 */

import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
// Supports both SUPABASE_KEY and SUPABASE_ANON_KEY for flexibility
const supabaseUrl = process.env.SUPABASE_URL || 'https://bmiuogfvzycwsfkbphpg.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase key. Please set SUPABASE_KEY or SUPABASE_ANON_KEY in your .env file')
}

// Create Supabase client (only if we have a key)
export const supabase = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (supabase) {
  console.log('✅ Supabase client initialized')
  console.log('📍 Supabase URL:', supabaseUrl)
} else {
  console.warn('⚠️ Supabase client not initialized - missing key')
}

// Export for use in other modules
export default supabase