module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Verificar variáveis de ambiente (sem expor valores sensíveis)
  const envCheck = {
    hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasGoogleKey: !!process.env.GOOGLE_PRIVATE_KEY,
    hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
    googleEmailLength: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.length || 0,
    googleKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
    spreadsheetIdLength: process.env.GOOGLE_SPREADSHEET_ID?.length || 0,
    emailPrefix: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.substring(0, 20) + '...',
    keyPrefix: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30) + '...',
    spreadsheetPrefix: process.env.GOOGLE_SPREADSHEET_ID?.substring(0, 20) + '...'
  };
  
  res.json({ 
    status: 'Environment Check',
    timestamp: new Date().toISOString(),
    environment: 'vercel-production',
    variables: envCheck,
    allConfigured: envCheck.hasGoogleEmail && envCheck.hasGoogleKey && envCheck.hasSpreadsheetId
  });
};
