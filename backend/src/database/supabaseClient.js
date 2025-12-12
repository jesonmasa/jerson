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
// HARDCODED FALLBACK PARA CORREGIR ERROR DE CONEXIÓN EN RENDER
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXVvZ2Z2enljd3Nma2JwaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODkwOTMsImV4cCI6MjA4MTA2NTA5M30.ZoUOuiEzKTykL418jpsUlFTrVTv515Fnam0FS-l795g'

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