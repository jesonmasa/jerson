/**
 * Supabase Database Module
 * Replaces the file-based multi-tenant database with Supabase PostgreSQL
 */

import { supabase } from './supabaseClient.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

// ============================================
// PLATFORM MANAGEMENT (GLOBAL DATA)
// ============================================

export const platform = {
  // Initialize platform (not needed with Supabase)
  async init() {
    console.log('✅ Supabase platform initialized')
    // AUTO-INIT SUPER ADMIN (Solo en desarrollo)
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV)
    
    // Check if we need to create super admin
    const { data: users, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
    
    console.log('🔍 Current users count:', users?.length || 0)
    
    // Solo crear super admin si no existen usuarios y estamos en desarrollo
    if ((!users || users.length === 0) && process.env.NODE_ENV === 'development') {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@constructor.test'
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'constructor123'
      
      console.log('👑 Creando Super Admin para desarrollo...')
      const hashedPassword = await bcrypt.hash(superAdminPassword, 12)
      const tenantId = uuidv4()

      const { data: superAdmin, error: insertError } = await supabase
        .from('users')
        .insert({
          id: uuidv4(),
          tenant_id: tenantId,
          email: superAdminEmail,
          password: hashedPassword,
          name: 'Super Admin',
          role: 'super_admin',
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating super admin:', insertError)
        return
      }

      // Create tenant for super admin
      await tenant.create(tenantId, {
        store_name: "Super Admin Store",
        owner_email: superAdminEmail
      })

      console.log(`✨ Super Admin creado: ${superAdminEmail} / ${superAdminPassword}`)
    } else {
      console.log('⏭️  Skipping super admin creation. Users exist or not in development mode.')
    }
  },

  // ========== USERS ==========
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()
    
    if (error) {
      console.error('Error finding user by email:', error)
      return null
    }
    
    return data
  },

  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    
    if (error) {
      console.error('Error finding user by id:', error)
      return null
    }
    
    return data
  },

  async createUser(userData) {
    const id = uuidv4()
    const tenantId = uuidv4()

    const { data, error } = await supabase
      .from('users')
      .insert({
        id,
        tenant_id: tenantId,
        email: userData.email.toLowerCase(),
        password: userData.password, // Already hashed
        name: userData.name,
        role: userData.role || 'owner',
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    // Create tenant folder
    await tenant.create(tenantId, {
      store_name: userData.name + "'s Store",
      owner_email: userData.email
    })

    return data
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, tenant_id, email, name, role, email_verified, created_at')
    
    if (error) {
      console.error('Error getting all users:', error)
      return []
    }

    return data
  },

  // ========== VERIFICATION CODES ==========
  async createVerificationCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

    // Delete old codes for this email
    await supabase
      .from('verification_codes')
      .delete()
      .eq('email', email.toLowerCase())

    // Insert new code
    const { error } = await supabase
      .from('verification_codes')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating verification code:', error)
      return null
    }

    return code
  },

  async verifyCode(email, code) {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .maybeSingle()

    if (error) {
      console.error('Error verifying code:', error)
      return { valid: false, error: 'Error de verificación' }
    }

    if (!data) {
      return { valid: false, error: 'Código inválido' }
    }

    if (new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'Código expirado' }
    }

    // Delete used code
    await supabase
      .from('verification_codes')
      .delete()
      .eq('email', email.toLowerCase())

    return { valid: true }
  },

  // ========== SUBSCRIPTIONS ==========
  async createSubscription(userId, planData) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        id: uuidv4(),
        user_id: userId,
        plan_id: planData.planId,
        plan_name: planData.planName,
        price_monthly: planData.priceMonthly,
        stripe_customer_id: planData.stripeCustomerId || null,
        stripe_subscription_id: planData.stripeSubscriptionId || null,
        status: 'active', // active, canceled, past_due, trialing
        current_period_start: new Date().toISOString(),
        current_period_end: planData.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }

    return data
  },

  async getSubscription(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()
    
    if (error) {
      console.error('Error getting subscription:', error)
      return null
    }
    
    return data
  },

  async updateSubscription(subscriptionId, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }
    
    return data
  },

  async getAllSubscriptions() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
    
    if (error) {
      console.error('Error getting all subscriptions:', error)
      return []
    }
    
    return data
  },

  async getPlatformStats() {
    // Get user counts
    const { count: totalUsers, error: userCountError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { count: verifiedUsers, error: verifiedCountError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('email_verified', true)
    
    // Get subscription counts
    const { count: activeSubscriptions, error: subCountError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    // Calculate revenue
    const { data: subscriptions, error: revenueError } = await supabase
      .from('subscriptions')
      .select('price_monthly')
      .eq('status', 'active')
    
    let monthlyRevenue = 0
    if (subscriptions) {
      monthlyRevenue = subscriptions.reduce((sum, sub) => sum + (sub.price_monthly || 0), 0)
    }
    
    return {
      total_tenants: totalUsers || 0,
      active_subscriptions: activeSubscriptions || 0,
      monthly_revenue: monthlyRevenue,
      total_users: totalUsers || 0,
      verified_users: verifiedUsers || 0
    }
  }
}

// ============================================
// TENANT MANAGEMENT (ISOLATED DATA)
// ============================================

export const tenant = {
  // Create new tenant
  async create(tenantId, initialConfig = {}) {
    const { error } = await supabase
      .from('tenants')
      .insert({
        id: tenantId,
        store_name: initialConfig.storeName || 'Mi Tienda',
        owner_email: initialConfig.ownerEmail || '',
        theme_id: 'tienda-mascotas',
        logo_url: '',
        banner_image: '',
        contact_phone: '',
        contact_email: '',
        address: '',
        social_links: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating tenant:', error)
      return false
    }

    console.log(`✅ Tenant ${tenantId} created`)
    return true
  },

  // Check if tenant exists
  async exists(tenantId) {
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', tenantId)
      .maybeSingle()
    
    return !!data
  },

  // ========== CONFIG ==========
  async getConfig(tenantId) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .maybeSingle()
    
    if (error) {
      console.error('Error getting tenant config:', error)
      return null
    }
    
    return data
  },

  async updateConfig(tenantId, updates) {
    const { data, error } = await supabase
      .from('tenants')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tenantId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating tenant config:', error)
      return null
    }
    
    return data
  },

  // ========== CRUD FOR COLLECTIONS ==========
  async findAll(tenantId, collection) {
    // For products, orders, categories, etc.
    const { data, error } = await supabase
      .from(collection)
      .select('*')
      .eq('tenant_id', tenantId)
    
    if (error) {
      console.error(`Error finding all ${collection}:`, error)
      return []
    }
    
    return data
  },

  async findById(tenantId, collection, id) {
    const { data, error } = await supabase
      .from(collection)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .maybeSingle()
    
    if (error) {
      console.error(`Error finding ${collection} by id:`, error)
      return null
    }
    
    return data
  },

  async findOne(tenantId, collection, condition) {
    let query = supabase
      .from(collection)
      .select('*')
      .eq('tenant_id', tenantId)
    
    // Apply conditions
    for (const [key, value] of Object.entries(condition)) {
      query = query.eq(key, value)
    }
    
    const { data, error } = await query.maybeSingle()
    
    if (error) {
      console.error(`Error finding one ${collection}:`, error)
      return null
    }
    
    return data
  },

  async insert(tenantId, collection, item) {
    const newItem = {
      id: uuidv4(),
      tenant_id: tenantId,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(collection)
      .insert(newItem)
      .select()
      .single()

    if (error) {
      console.error(`Error inserting ${collection}:`, error)
      return null
    }

    return data
  },

  async update(tenantId, collection, id, updates) {
    const { data, error } = await supabase
      .from(collection)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating ${collection}:`, error)
      return null
    }

    return data
  },

  async delete(tenantId, collection, id) {
    const { error } = await supabase
      .from(collection)
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', id)

    if (error) {
      console.error(`Error deleting ${collection}:`, error)
      return false
    }

    return true
  },

  // ========== ANALYTICS ==========
  async getAnalytics(tenantId) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle()
    
    if (error) {
      console.error('Error getting analytics:', error)
      return null
    }
    
    // Return default analytics if not found
    return data || {
      total_sales: 0,
      total_orders: 0,
      products_sold: [],
      monthly_revenue: []
    }
  },

  async updateAnalytics(tenantId, updates) {
    // First try to get existing analytics
    const existing = await this.getAnalytics(tenantId)
    
    if (existing && existing.id) {
      // Update existing
      const { data, error } = await supabase
        .from('analytics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', tenantId)
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating analytics:', error)
        return null
      }
      
      return data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('analytics')
        .insert({
          id: uuidv4(),
          tenant_id: tenantId,
          total_sales: 0,
          total_orders: 0,
          products_sold: [],
          monthly_revenue: [],
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating analytics:', error)
        return null
      }
      
      return data
    }
  },

  async recordSale(tenantId, orderData) {
    const analytics = await this.getAnalytics(tenantId)
    
    // Update analytics
    const updatedAnalytics = {
      total_sales: (analytics?.total_sales || 0) + (orderData.total || 0),
      total_orders: (analytics?.total_orders || 0) + 1,
      products_sold: [...(analytics?.products_sold || [])],
      monthly_revenue: [...(analytics?.monthly_revenue || [])]
    }

    // Register sold products
    for (const item of orderData.items || []) {
      const existing = updatedAnalytics.products_sold.find(p => p.product_id === item.product_id)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        updatedAnalytics.products_sold.push({
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        })
      }
    }

    return await this.updateAnalytics(tenantId, updatedAnalytics)
  }
}

// ============================================
// AGGREGATION FOR SUPER ADMIN
// ============================================

export const aggregation = {
  // Get global stats for all tenants
  async getGlobalStats() {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, tenant_id, name')
    
    if (usersError) {
      console.error('Error getting users for global stats:', usersError)
      return {}
    }

    let totalProducts = 0
    let totalOrders = 0
    let totalRevenue = 0
    const productsByCategory = {}
    const topProducts = []

    for (const user of users) {
      if (!user.tenant_id) continue

      try {
        // Get products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', user.tenant_id)
        
        // Get orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('tenant_id', user.tenant_id)
        
        // Get analytics
        const { data: analytics, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .eq('tenant_id', user.tenant_id)
          .maybeSingle()

        if (products) {
          totalProducts += products.length
          
          // Group by category
          for (const product of products) {
            const cat = product.category || 'Sin categoría'
            productsByCategory[cat] = (productsByCategory[cat] || 0) + 1
          }
        }

        if (orders) {
          totalOrders += orders.length
        }

        if (analytics) {
          totalRevenue += analytics.total_sales || 0
          
          // Top selling products
          for (const sold of analytics.products_sold || []) {
            topProducts.push({
              ...sold,
              tenant_id: user.tenant_id,
              store_name: user.name
            })
          }
        }
      } catch (error) {
        console.warn(`Error processing tenant ${user.tenant_id} for global stats:`, error.message)
      }
    }

    // Sort top products
    topProducts.sort((a, b) => b.quantity - a.quantity)

    // Get subscription stats
    const { count: activeSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    // Calculate MRR
    const { data: subscriptions, error: mrrError } = await supabase
      .from('subscriptions')
      .select('price_monthly')
      .eq('status', 'active')
    
    let monthlyRecurringRevenue = 0
    if (subscriptions) {
      monthlyRecurringRevenue = subscriptions.reduce((sum, sub) => sum + (sub.price_monthly || 0), 0)
    }

    return {
      totalTenants: users.length,
      activeSubscriptions: activeSubscriptions || 0,
      totalProducts,
      totalOrders,
      totalRevenue,
      productsByCategory,
      topProducts: topProducts.slice(0, 10),
      monthlyRecurringRevenue
    }
  },

  // Get trends for a specific tenant
  async getTrendsForTenant(tenantId) {
    const globalStats = await this.getGlobalStats()

    return {
      topSellingCategories: Object.entries(globalStats.productsByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, count]) => ({ category, count })),
      trendingProducts: globalStats.topProducts.slice(0, 5).map(p => ({
        name: p.product_name,
        sales: p.quantity
      })),
      platformAvgRevenue: globalStats.totalRevenue / Math.max(globalStats.totalTenants, 1)
    }
  },

  // Get all marketplace products
  async getAllMarketplaceProducts() {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, tenant_id, name')
    
    if (usersError) {
      console.error('Error getting users for marketplace:', usersError)
      return []
    }

    const allProducts = []

    for (const user of users) {
      if (!user.tenant_id) continue

      try {
        // Get tenant config for store name
        const { data: config, error: configError } = await supabase
          .from('tenants')
          .select('store_name')
          .eq('id', user.tenant_id)
          .maybeSingle()
        
        const storeName = config?.store_name || user.name + "'s Store"

        // Get published products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', user.tenant_id)
          .eq('status', 'published')

        if (products) {
          const enriched = products.map(p => ({
            ...p,
            tenant_id: user.tenant_id,
            store_name: storeName,
            store_url: `/store/${user.tenant_id}`
          }))
          allProducts.push(...enriched)
        }
      } catch (error) {
        console.warn(`Error reading tenant ${user.tenant_id} for marketplace:`, error.message)
      }
    }

    // Random sort
    return allProducts.sort(() => Math.random() - 0.5)
  },

  // Get all stores
  async getAllStores() {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, tenant_id, name')
    
    if (usersError) {
      console.error('Error getting users for stores:', usersError)
      return []
    }

    const stores = []

    for (const user of users) {
      if (!user.tenant_id) continue

      try {
        const { data: config, error: configError } = await supabase
          .from('tenants')
          .select('store_name, logo_url, is_published')
          .eq('id', user.tenant_id)
          .maybeSingle()
        
        // Filter: Only show published stores
        if (config && config.is_published === false) continue

        // Get product count
        const { count: productCount, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', user.tenant_id)

        stores.push({
          id: user.tenant_id,
          name: config?.store_name || user.name + "'s Store",
          url: `/store/${user.tenant_id}`,
          logo: config?.logo_url || '',
          product_count: productCount || 0
        })
      } catch (error) { 
        console.warn(`⚠️ Error procesando tienda ${user.tenant_id}:`, error.message)
      }
    }
    
    return stores
  },

  // Get flash deals
  async getFlashDeals() {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, tenant_id, name')
    
    if (usersError) {
      console.error('Error getting users for flash deals:', usersError)
      return []
    }

    const flashDeals = []

    for (const user of users) {
      if (!user.tenant_id) continue

      try {
        // Get tenant config
        const { data: config, error: configError } = await supabase
          .from('tenants')
          .select('store_name')
          .eq('id', user.tenant_id)
          .maybeSingle()
        
        const storeName = config?.store_name || user.name + "'s Store"

        // Get discounted products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', user.tenant_id)
          .eq('status', 'published')
          .gt('discount', 0)

        // Sort by discount
        if (products) {
          const sorted = products.sort((a, b) => b.discount - a.discount)
          
          // Take the best deal
          if (sorted.length > 0) {
            const bestDeal = sorted[0]
            flashDeals.push({
              ...bestDeal,
              tenant_id: user.tenant_id,
              store_name: storeName,
              store_url: `/store/${user.tenant_id}`
            })
          }
        }
      } catch (error) {
        console.warn(`Error getting flash deal for tenant ${user.tenant_id}:`, error.message)
      }
    }

    // Sort globally by discount
    return flashDeals.sort((a, b) => b.discount - a.discount)
  }
}

// Initialize on import
platform.init().catch(console.error)

export default { platform, tenant, aggregation }