import { google } from 'googleapis';

export class GoogleSheetsAPI {
  private static auth: any = null;
  private static sheets: any = null;

  private static async getAuth() {
    if (this.auth) return this.auth;

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!serviceAccountEmail || !privateKey) {
      throw new Error('Google Service Account credentials not configured');
    }

    this.auth = new google.auth.JWT(
      serviceAccountEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    await this.auth.authorize();
    return this.auth;
  }

  private static async getSheetsInstance() {
    if (this.sheets) return this.sheets;

    const auth = await this.getAuth();
    this.sheets = google.sheets({ version: 'v4', auth });
    return this.sheets;
  }

  static async markAsReserved(
    giftTitle: string,
    reservedBy: string,
    rowIndex: number
  ): Promise<boolean> {
    try {
      const sheets = await this.getSheetsInstance();
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

      if (!spreadsheetId) {
        throw new Error('Google Spreadsheet ID not configured');
      }

      // Atualizar a coluna F (Reservado) e G (Reservado Por)
      const values = [
        ['Sim', reservedBy] // F = "Sim", G = nome do padrinho
      ];

      const range = `Sheet1!F${rowIndex + 1}:G${rowIndex + 1}`; // +1 porque as planilhas começam em 1

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      console.log(`✅ Planilha atualizada: ${giftTitle} reservado por ${reservedBy}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar planilha:', error);
      return false;
    }
  }

  static async getReservations(): Promise<Array<{
    title: string;
    reserved: boolean;
    reservedBy?: string;
    rowIndex: number;
  }>> {
    try {
      const sheets = await this.getSheetsInstance();
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

      if (!spreadsheetId) {
        throw new Error('Google Spreadsheet ID not configured');
      }

      // Ler todas as colunas incluindo F (Reservado) e G (Reservado Por)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:G', // Incluir colunas F e G
      });

      const rows = response.data.values || [];
      const reservations = [];

      // Pular o cabeçalho (linha 0)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 1 && row[0]) { // Se tem pelo menos o título
          reservations.push({
            title: row[0],
            reserved: row[5] === 'Sim', // Coluna F
            reservedBy: row[6] || undefined, // Coluna G
            rowIndex: i,
          });
        }
      }

      return reservations;
    } catch (error) {
      console.error('❌ Erro ao ler reservas da planilha:', error);
      return [];
    }
  }

  static async syncReservations(): Promise<{[key: string]: { reserved: boolean; reservedBy?: string }}>  {
    try {
      const reservations = await this.getReservations();
      const syncData: {[key: string]: { reserved: boolean; reservedBy?: string }} = {};

      reservations.forEach(item => {
        // Usar o título como chave (mesmo ID usado no frontend)
        const giftId = this.generateUniqueId(item.title);
        syncData[giftId] = {
          reserved: item.reserved,
          reservedBy: item.reservedBy,
        };
      });

      return syncData;
    } catch (error) {
      console.error('❌ Erro ao sincronizar reservas:', error);
      return {};
    }
  }

  private static generateUniqueId(title: string): string {
    const cleanTitle = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `gift-${cleanTitle}-${Math.abs(hash)}`;
  }
}
