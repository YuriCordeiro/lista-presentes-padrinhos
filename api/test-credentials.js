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

      // Obter informações das abas
      const sheetNames = response.data.sheets.map(sheet => ({
        name: sheet.properties.title,
        id: sheet.properties.sheetId,
        index: sheet.properties.index
      }));

      res.json({
        status: 'success',
        message: 'Credenciais funcionando corretamente',
        spreadsheetTitle: response.data.properties.title,
        sheetsCount: response.data.sheets.length,
        sheetNames: sheetNames,
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
};
