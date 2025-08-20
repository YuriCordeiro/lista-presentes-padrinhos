const https = require('https');

function getSheetInfo() {
  return new Promise((resolve, reject) => {
    const url = `https://lista-presentes-padrinhos-cy.vercel.app/api/test-credentials`;
    
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

async function checkSheetNames() {
  console.log('🔍 Verificando informações da planilha...\n');
  
  try {
    const result = await getSheetInfo();
    console.log('Resposta completa:', JSON.stringify(result.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkSheetNames();
