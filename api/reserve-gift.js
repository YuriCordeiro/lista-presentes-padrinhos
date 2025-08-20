module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📝 Recebida reserva:', req.body);
    
    const { giftTitle, reservedBy, rowIndex } = req.body;

    if (!giftTitle || !reservedBy || rowIndex === undefined) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: giftTitle, reservedBy, rowIndex' 
      });
    }

    // Verificar se as credenciais do Google estão configuradas
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      console.log('⚠️ Credenciais Google não configuradas - salvando apenas localmente');
      
      return res.json({ 
        success: true, 
        message: 'Presente reservado localmente (Google Sheets não configurado)',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex + 1,
        warning: 'Google Sheets não configurado'
      });
    }

    // Tentar atualizar no Google Sheets
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

      // Atualizar a coluna F (Reservado) e G (Reservado Por)
      const range = `Lista!F${rowIndex + 1}:G${rowIndex + 1}`;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Sim', reservedBy]]
        }
      });

      console.log(`✅ Presente "${giftTitle}" reservado por "${reservedBy}" na linha ${rowIndex + 1} - PLANILHA ATUALIZADA`);

      res.json({ 
        success: true, 
        message: 'Presente reservado com sucesso na planilha Google Sheets',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex + 1,
        sheets_updated: true
      });

    } catch (sheetsError) {
      console.error('❌ Erro ao atualizar Google Sheets:', sheetsError);
      
      // Mesmo com erro no Sheets, consideramos sucesso localmente
      res.json({ 
        success: true, 
        message: 'Presente reservado localmente (erro na planilha)',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex + 1,
        warning: 'Erro ao atualizar planilha: ' + sheetsError.message
      });
    }

  } catch (error) {
    console.error('❌ Erro na API de reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
};
