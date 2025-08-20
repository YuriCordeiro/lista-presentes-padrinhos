module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar se as credenciais do Google estão configuradas
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      console.log('⚠️ Credenciais Google não configuradas');
      return res.json({ 
        success: true,
        data: {},
        count: 0,
        message: 'Google Sheets não configurado'
      });
    }

    // Conectar com Google Sheets e ler dados
    try {
      const { google } = require('googleapis');
      
      const credentials = {
        type: 'service_account',
        client_email: serviceAccountEmail,
        private_key: privateKey,
      };

      const auth = google.auth.fromJSON(credentials);
      auth.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

      await auth.authorize();

      const sheets = google.sheets({ version: 'v4', auth });

      // Ler todas as linhas da planilha (assumindo que tem dados até linha 100)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Lista!A1:G100', // Colunas A-G, linhas 1-100
      });

      const rows = response.data.values || [];
      const reservations = {};

      // Processar dados (pulando header na linha 1)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 6) {
          const title = row[0]; // Coluna A - Título
          const productUrl = row[1]; // Coluna B - URL do Produto
          const imageUrl = row[2]; // Coluna C - URL da Imagem
          const order = row[3]; // Coluna D - Ordem
          const visible = row[4]; // Coluna E - Exibir (Sim/Não)
          const reserved = row[5]; // Coluna F - Reservado (Sim/Não)
          const reservedBy = row[6] || ''; // Coluna G - Reservado Por

          // Criar um ID baseado no título (mesmo método do frontend)
          const giftId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

          if (reserved === 'Sim') {
            reservations[giftId] = {
              reserved: true,
              reservedBy: reservedBy,
              title: title,
              rowIndex: i
            };
          }
        }
      }

      console.log(`🔄 Sincronização concluída: ${Object.keys(reservations).length} presentes reservados encontrados`);

      res.json({ 
        success: true,
        data: reservations,
        count: Object.keys(reservations).length,
        timestamp: new Date().toISOString()
      });

    } catch (sheetsError) {
      console.error('❌ Erro ao ler Google Sheets:', sheetsError);
      
      res.status(500).json({ 
        success: false,
        error: 'Erro ao ler planilha',
        details: sheetsError.message
      });
    }

  } catch (error) {
    console.error('❌ Erro na API de sincronização:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
};
