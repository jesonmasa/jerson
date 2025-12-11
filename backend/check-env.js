/**
 * Check Environment Variables
 * Simple script to check if environment variables are loaded correctly
 */

import dotenv from 'dotenv'
dotenv.config()

console.log('=== Environment Variables Check ===')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Loaded' : 'Not found')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not found')
console.log('==================================')