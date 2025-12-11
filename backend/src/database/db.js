/**
 * Database Module Selector
 * This file allows easy switching between file-based and Supabase database.
 * 
 * To switch databases, just change USE_SUPABASE below.
 */

// ================================================
// 🔧 DATABASE CONFIGURATION
// ================================================
// Set to true to use Supabase (cloud), false for file-based (local)
const USE_SUPABASE = true;
// ================================================

// Import both modules - only one will actually be used based on USE_SUPABASE
import * as supabaseDB from './supabaseDB.js';
import * as multiTenantDB from './multiTenantDB.js';

let platform, tenant, aggregation;

if (USE_SUPABASE) {
    console.log('🗄️  Using Supabase database (cloud)');
    platform = supabaseDB.platform;
    tenant = supabaseDB.tenant;
    aggregation = supabaseDB.aggregation;
} else {
    console.log('📁 Using file-based database (local)');
    platform = multiTenantDB.platform;
    tenant = multiTenantDB.tenant;
    aggregation = multiTenantDB.aggregation;
}

export { platform, tenant, aggregation };
export default { platform, tenant, aggregation };
