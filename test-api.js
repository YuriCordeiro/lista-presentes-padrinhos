const https = require('https');

function testAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://lista-presentes-padrinhos-cy.vercel.app/api/${endpoint}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data.toString() });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🧪 Testando endpoints da API...\n');
  
  try {
    // Test health
    console.log('1. Testando health check...');
    const health = await testAPI('health');
    console.log(`Status: ${health.status}`);
    console.log('Response:', JSON.stringify(health.data, null, 2));
    console.log();
    
    // Test debug
    console.log('2. Testando debug...');
    const debug = await testAPI('debug');
    console.log(`Status: ${debug.status}`);
    console.log('Response:', JSON.stringify(debug.data, null, 2));
    console.log();
    
    // Test credentials
    console.log('3. Testando test-credentials...');
    const credentials = await testAPI('test-credentials');
    console.log(`Status: ${credentials.status}`);
    console.log('Response:', JSON.stringify(credentials.data, null, 2));
    console.log();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

runTests();
