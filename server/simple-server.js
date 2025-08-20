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

// Test credentials endpoint
app.get('/api/test-credentials', async (req, res) => {
  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Log da estrutura da chave privada (apenas início e fim)
    const keyStart = privateKey ? privateKey.substring(0, 50) : 'undefined';
    const keyEnd = privateKey ? privateKey.substring(privateKey.length - 50) : 'undefined';
    
    console.log('🔍 Testando credenciais Google...');
    console.log('📧 Email:', serviceAccountEmail);
    console.log('🔑 Key start:', keyStart);
    console.log('🔑 Key end:', keyEnd);
    console.log('📋 Spreadsheet ID:', spreadsheetId);
    console.log('🔑 Key contains \\n?:', privateKey?.includes('\\n'));
    console.log('🔑 Key contains newlines?:', privateKey?.includes('\n'));

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      return res.json({
        status: 'error',
        message: 'Credenciais não configuradas',
        hasEmail: !!serviceAccountEmail,
        hasKey: !!privateKey,
        hasSpreadsheetId: !!spreadsheetId
      });
    }

    // Tentar autenticar
    try {
      const { google } = require('googleapis');
      
      const credentials = {
        type: 'service_account',
        client_email: serviceAccountEmail,
        private_key: privateKey,
      };

      console.log('🔗 Tentando autenticar...');
      const auth = google.auth.fromJSON(credentials);
      auth.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

      await auth.authorize();
      console.log('✅ Autenticação bem-sucedida');

      // Testar acesso à planilha
      const sheets = google.sheets({ version: 'v4', auth });
      const response = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });

      res.json({
        status: 'success',
        message: 'Credenciais funcionando corretamente',
        spreadsheetTitle: response.data.properties.title,
        sheetsCount: response.data.sheets.length,
        timestamp: new Date().toISOString()
      });

    } catch (authError) {
      console.error('❌ Erro de autenticação:', authError);
      
      res.json({
        status: 'auth_error',
        message: 'Erro na autenticação Google',
        error: authError.message,
        errorType: authError.constructor.name,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno',
      error: error.message
    });
  }
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
        rowIndex: rowIndex,
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
      // rowIndex já vem ajustado do frontend (i do loop que começa em 1)
      const range = `Lista!F${rowIndex}:G${rowIndex}`;
      
      console.log(`📝 Atualizando range: ${range} com valores: ['Sim', '${reservedBy}']`);
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Sim', reservedBy]]
        }
      });

      console.log(`✅ Presente "${giftTitle}" reservado por "${reservedBy}" na linha ${rowIndex} - PLANILHA ATUALIZADA`);

      res.json({ 
        success: true, 
        message: 'Presente reservado com sucesso na planilha Google Sheets',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex,
        sheets_updated: true
      });

    } catch (sheetsError) {
      console.error('❌ Erro ao atualizar Google Sheets:', sheetsError);
      console.error('📋 Stack trace:', sheetsError.stack);
      
      // Mesmo com erro no Sheets, consideramos sucesso localmente
      res.json({ 
        success: true, 
        message: 'Presente reservado localmente (erro na planilha)',
        giftTitle,
        reservedBy,
        rowIndex: rowIndex,
        warning: 'Erro ao atualizar planilha: ' + sheetsError.message,
        error_details: sheetsError.stack
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
