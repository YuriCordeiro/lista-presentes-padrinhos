const https = require('https');

function testReservation() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      giftId: "test-gift-123",
      giftTitle: "Teste de Reserva API",
      reservedBy: "Yuri Teste Local",
      rowIndex: 2
    });

    const options = {
      hostname: 'lista-presentes-padrinhos-cy.vercel.app',
      port: 443,
      path: '/api/reserve-gift',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
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
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function runReservationTest() {
  console.log('🧪 Testando reserva de presente...\n');
  
  try {
    const result = await testReservation();
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.success) {
      console.log('\n✅ Teste de reserva SUCESSO!');
      if (result.data.sheets_updated) {
        console.log('📊 Planilha foi atualizada com sucesso!');
      } else if (result.data.warning) {
        console.log('⚠️ Aviso:', result.data.warning);
      }
    } else {
      console.log('\n❌ Teste de reserva FALHOU!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

runReservationTest();
