// Run this script to verify your Supabase setup
// Usage: node verify-supabase-setup.js

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verifying Supabase Setup...\n');

// Check environment variables
console.log('1. Checking environment variables...');
if (!SUPABASE_URL) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
} else {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL is set');
  console.log(`      ${SUPABASE_URL}`);
}

if (!SUPABASE_ANON_KEY) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local');
  process.exit(1);
} else {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
  console.log(`      ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
}

// Test connection
console.log('\n2. Testing Supabase connection...');
fetch(`${SUPABASE_URL}/rest/v1/`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  }
})
  .then(response => {
    if (response.ok) {
      console.log('   ✅ Successfully connected to Supabase');
      return testProductsTable();
    } else {
      console.log('   ❌ Failed to connect to Supabase');
      console.log(`      Status: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('   ❌ Connection error:', error.message);
    process.exit(1);
  });

// Test products table
async function testProductsTable() {
  console.log('\n3. Checking products table...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'count=exact'
      }
    });

    if (response.ok) {
      const count = response.headers.get('content-range')?.split('/')[1] || '0';
      console.log('   ✅ Products table exists');
      console.log(`      Found ${count} products`);
      
      if (count === '0') {
        console.log('\n   ⚠️  No products found. Did you run supabase-setup.sql?');
      }
      
      return testStorage();
    } else {
      console.log('   ❌ Products table not found or not accessible');
      console.log('      Did you run supabase-setup.sql?');
      process.exit(1);
    }
  } catch (error) {
    console.log('   ❌ Error checking products table:', error.message);
    process.exit(1);
  }
}

// Test storage bucket
async function testStorage() {
  console.log('\n4. Checking storage bucket...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket/product-images`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      console.log('   ✅ Storage bucket "product-images" exists');
    } else if (response.status === 404) {
      console.log('   ❌ Storage bucket "product-images" not found');
      console.log('      Did you run supabase-storage-setup.sql?');
    } else {
      console.log('   ⚠️  Could not verify storage bucket');
      console.log(`      Status: ${response.status}`);
    }
  } catch (error) {
    console.log('   ⚠️  Error checking storage:', error.message);
  }

  console.log('\n✨ Setup verification complete!\n');
  
  console.log('Next steps:');
  console.log('1. If any checks failed, follow the instructions in SUPABASE_SETUP_GUIDE.md');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  console.log('4. Test the admin panel: http://localhost:3000/admin\n');
}
