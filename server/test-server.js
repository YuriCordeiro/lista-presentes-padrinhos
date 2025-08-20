require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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

// Test Google API
app.get('/api/test-google', async (req, res) => {
  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      return res.status(400).json({
        error: 'Credenciais Google não configuradas',
        has_email: !!serviceAccountEmail,
        has_key: !!privateKey,
        has_spreadsheet: !!spreadsheetId
      });
    }

    const credentials = {
      type: 'service_account',
      client_email: serviceAccountEmail,
      private_key: privateKey,
    };

    const auth = google.auth.fromJSON(credentials);
    auth.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    await auth.authorize();

    const sheets = google.sheets({ version: 'v4', auth });

    // Teste: Ler dados da planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Lista!A1:F10', // Tentativa de ler algumas linhas
    });

    res.json({
      success: true,
      message: 'Conexão com Google Sheets funcionando!',
      rows: response.data.values?.length || 0,
      first_row: response.data.values?.[0] || null
    });

  } catch (error) {
    console.error('Erro ao testar Google API:', error);
    res.status(500).json({
      error: 'Erro ao conectar com Google Sheets',
      details: error.message
    });
  }
});

// Marcar presente como reservado
app.post('/api/reserve-gift', async (req, res) => {
  try {
    const { giftTitle, reservedBy, rowIndex } = req.body;

    if (!giftTitle || !reservedBy || rowIndex === undefined) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: giftTitle, reservedBy, rowIndex' 
      });
    }

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

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

    console.log(`✅ Presente "${giftTitle}" reservado por "${reservedBy}" na linha ${rowIndex + 1}`);

    res.json({ 
      success: true, 
      message: 'Presente reservado com sucesso na planilha',
      giftTitle,
      reservedBy,
      rowIndex: rowIndex + 1
    });

  } catch (error) {
    console.error('Erro na API de reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor teste rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Teste Google: http://localhost:${PORT}/api/test-google`);
  console.log(`🎁 API Reserva: POST http://localhost:${PORT}/api/reserve-gift`);
});
