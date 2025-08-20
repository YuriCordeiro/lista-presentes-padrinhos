import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { GoogleSheetsAPI } from './GoogleSheetsAPI';
import path from 'path';

// Carregar variáveis de ambiente do diretório pai
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Permitir o frontend local
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Marcar presente como reservado
app.post('/api/reserve-gift', async (req, res) => {
  try {
    const { giftTitle, giftId, reservedBy, rowIndex } = req.body;

    if (!giftTitle || !reservedBy || rowIndex === undefined) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: giftTitle, reservedBy, rowIndex' 
      });
    }

    const success = await GoogleSheetsAPI.markAsReserved(giftTitle, reservedBy, rowIndex);

    if (success) {
      res.json({ 
        success: true, 
        message: 'Presente reservado com sucesso na planilha',
        giftId,
        reservedBy
      });
    } else {
      res.status(500).json({ 
        error: 'Falha ao atualizar a planilha' 
      });
    }
  } catch (error) {
    console.error('Erro na API de reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Obter status das reservas
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await GoogleSheetsAPI.syncReservations();
    res.json({ 
      success: true, 
      reservations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao obter reservas:', error);
    res.status(500).json({ 
      error: 'Erro ao obter reservas',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sincronizar reservas (endpoint para o frontend usar)
app.get('/api/sync-reservations', async (req, res) => {
  try {
    const syncData = await GoogleSheetsAPI.syncReservations();
    res.json({ 
      success: true, 
      data: syncData,
      count: Object.keys(syncData).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ 
      error: 'Erro na sincronização',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API disponível para o frontend em http://localhost:5173`);
});
