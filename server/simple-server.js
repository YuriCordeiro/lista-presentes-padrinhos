require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API disponível para o frontend em http://localhost:5173`);
  console.log(`🔍 Teste: http://localhost:${PORT}/api/test`);
});
