// Test Supabase connection
// Run this in browser console after starting dev server

import { createClient } from '@/lib/supabase/client';

export async function testSupabaseConnection() {
  const supabase = createClient();
  
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (catError) {
      console.error('❌ Categories error:', catError);
      return false;
    }
    
    console.log('✅ Categories loaded:', categories?.length || 0);
    
    // Test 2: Check products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*, product_translations(*)')
      .limit(5);
    
    if (prodError) {
      console.error('❌ Products error:', prodError);
      return false;
    }
    
    console.log('✅ Products loaded:', products?.length || 0);
    
    // Test 3: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ Not logged in (this is normal)');
    } else {
      console.log('✅ Logged in as:', user?.email);
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}
