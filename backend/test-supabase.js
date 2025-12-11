/**
 * Test Supabase Connection
 * Simple script to test the Supabase connection
 */

import { supabase } from './src/database/supabaseClient.js'

async function testConnection() {
  console.log('🚀 Testing Supabase connection...')
  
  try {
    // Test database connection by getting the users table info
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Error connecting to Supabase:', error.message)
      return
    }
    
    console.log('✅ Successfully connected to Supabase!')
    console.log('📊 Users table exists and is accessible')
    
  } catch (error) {
    console.log('❌ Error testing connection:', error.message)
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
}

export default testConnection