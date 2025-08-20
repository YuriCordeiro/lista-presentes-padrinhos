export class ReservationAPI {
  private static getApiBaseUrl(): string {
    // Se estiver em produção (Vercel), usar a URL da própria aplicação
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return `${window.location.origin}/api`;
    }
    // Se estiver em desenvolvimento local
    return 'http://localhost:3001/api';
  }

  static async reserveGift(
    giftId: string,
    giftTitle: string,
    reservedBy: string,
    rowIndex: number
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/reserve-gift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftId,
          giftTitle,
          reservedBy,
          rowIndex,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro na API de reserva:', error);
        return false;
      }

      const result = await response.json();
      console.log('✅ Reserva salva na planilha:', result);
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar com a API:', error);
      return false;
    }
  }

  static async syncReservations(): Promise<{[key: string]: { reserved: boolean; reservedBy?: string }}> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/sync-reservations`);
      
      if (!response.ok) {
        console.error('❌ Erro ao sincronizar reservas');
        return {};
      }

      const result = await response.json();
      console.log('🔄 Reservas sincronizadas da planilha:', result.count, 'itens');
      return result.data || {};
    } catch (error) {
      console.error('❌ Erro ao sincronizar reservas:', error);
      return {};
    }
  }

  static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getApiBaseUrl()}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Servidor backend não está respondendo:', error);
      return false;
    }
  }
}
