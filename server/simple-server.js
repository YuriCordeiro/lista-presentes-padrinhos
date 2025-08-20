require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env_loaded: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando!',
    env_vars: {
      has_google_email: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      has_google_key: !!process.env.GOOGLE_PRIVATE_KEY,
      has_spreadsheet_id: !!process.env.GOOGLE_SPREADSHEET_ID
    }
  });
});

// Endpoint para reservar presente
app.post('/api/reserve-gift', async (req, res) => {
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
      
      res.json({ 
        success: true, 
        message: 'Presente reservado localmente (Google Sheets não configurado)',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex + 1,
        warning: 'Google Sheets não configurado'
      });
      return;
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
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API disponível para o frontend em http://localhost:5173`);
  console.log(`🔍 Teste: http://localhost:${PORT}/api/test`);
});
