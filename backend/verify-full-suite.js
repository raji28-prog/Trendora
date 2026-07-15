import http from 'http';

const postJson = (path, payload) => {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(dataString);
    req.end();
  });
};

const getJson = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${responseBody}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function runVerification() {
  console.log('--- Verifying SaaS AI Marketing Studio Backend API ---\n');

  try {
    // 1. Suggest keywords
    console.log('Test 1: POST /api/ai/suggest-keywords...');
    const kwResult = await postJson('/api/ai/suggest-keywords', {
      category: 'Bakery',
      objective: 'Brand Awareness'
    });
    if (kwResult.success && Array.isArray(kwResult.data)) {
      console.log(`✅ Passed. Keyword suggestions: [${kwResult.data.join(', ')}]\n`);
    } else {
      console.log('❌ Failed keyword suggestion test.', kwResult);
    }

    // 2. Fetch history
    console.log('Test 2: GET /api/ai/history...');
    const historyResult = await getJson('/api/ai/history');
    if (historyResult.success && Array.isArray(historyResult.data)) {
      console.log(`✅ Passed. Found ${historyResult.data.length} campaign history records.\n`);
    } else {
      console.log('❌ Failed history list test.', historyResult);
    }

    // 3. Fetch analytics
    console.log('Test 3: GET /api/ai/analytics...');
    const analyticsResult = await getJson('/api/ai/analytics');
    if (analyticsResult.success && analyticsResult.data) {
      console.log(`✅ Passed. Metrics:`);
      console.log(`   ├─ Total AI Generations: ${analyticsResult.data.totalAI}`);
      console.log(`   ├─ Total Reports: ${analyticsResult.data.totalReports}`);
      console.log(`   ├─ Top Platform: ${analyticsResult.data.mostUsedPlatform}`);
      console.log(`   └─ Top Category: ${analyticsResult.data.mostUsedCategory}\n`);
    } else {
      console.log('❌ Failed analytics metrics test.', analyticsResult);
    }

    console.log('API Integration Verification Finished.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification script crashed:', err.message);
    process.exit(1);
  }
}

runVerification();
