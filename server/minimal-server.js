const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/reserve-gift', (req, res) => {
  console.log('Reserve gift called:', req.body);
  res.json({ 
    success: true, 
    message: 'Teste OK',
    data: req.body
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});
