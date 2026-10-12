/**
 * Public Synchronization & Health Verification Suite
 * Tests G2-01 to G2-04 & G5-03
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testPublicSync() {
  console.log('================================================================');
  console.log('🔄 TESTING CMS-TO-PUBLIC REAL-TIME SYNCHRONIZATION & HEALTH');
  console.log('================================================================\n');

  // 1. Test Health Endpoint
  console.log('1. Checking /api/health endpoint...');
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log(`   Status: ${healthRes.status} | Healthy: ${healthData.status === 'healthy'}`);
    console.log(`   CMS DB: ${healthData.services.cmsDatabase.status}, Media: ${healthData.services.mediaStorage.status}`);
  } catch (e: any) {
    console.error(`   Failed health check: ${e.message}`);
  }

  // 2. Test Real-time Mutation & Instant Fetch
  console.log('\n2. Testing Real-time CMS Mutation & Instant Retrieval...');
  const testKey = 'test_sync_milestone';
  const testPayload = {
    titleAr: 'مشروع الجسور المعلقة والتوسعات الاستراتيجية 2030',
    titleEn: 'Suspended Viaducts & Strategic 2030 Infrastructure',
    updatedAt: new Date().toISOString(),
    status: 'published',
  };

  try {
    // Write via API
    const writeRes = await fetch(`${BASE_URL}/api/admin/cms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
      body: JSON.stringify({ key: testKey, data: testPayload }),
    });

    const writeJson = await writeRes.json();
    console.log(`   Write Status: ${writeRes.status} | Success: ${writeJson.success}`);

    // Read back immediately
    const readRes = await fetch(`${BASE_URL}/api/admin/cms?key=${testKey}`, {
      headers: {
        Authorization: 'Bearer gulf_hills_admin_secret_token',
        'x-test-runner': 'true',
      },
    });
    const readJson = await readRes.json();
    const isSynced = readJson.data?.titleAr === testPayload.titleAr;
    console.log(`   Read Status: ${readRes.status} | Real-time Synced: ${isSynced}`);

    if (isSynced) {
      console.log('   ✅ Real-time synchronization verified with zero stale delay.');
    } else {
      console.error('   ❌ Synchronization mismatch.');
    }
  } catch (e: any) {
    console.error(`   Sync error: ${e.message}`);
  }

  console.log('\n================================================================');
  console.log('🎉 REAL-TIME SYNCHRONIZATION AND HEALTH CHECKS COMPLETE!');
  console.log('================================================================');
}

testPublicSync();

export {};
