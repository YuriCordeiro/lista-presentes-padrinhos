import emailjs from '@emailjs/browser';
import type { ReservationData } from '../types';

export class EmailService {
  // Configurações do EmailJS via variáveis de ambiente
  private static readonly SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
  private static readonly TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
  private static readonly PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

  // Emails dos noivos via variáveis de ambiente
  private static readonly BRIDE_EMAIL = import.meta.env.VITE_BRIDE_EMAIL || 'carol@example.com';
  private static readonly GROOM_EMAIL = import.meta.env.VITE_GROOM_EMAIL || 'yuri@example.com';

  static async sendReservationEmail(reservationData: ReservationData): Promise<boolean> {
    try {
      console.log('📧 Enviando email de reserva:', reservationData);
      
      // Verificar se as configurações estão definidas
      if (this.SERVICE_ID === 'your_service_id' || 
          this.TEMPLATE_ID === 'your_template_id' || 
          this.PUBLIC_KEY === 'your_public_key' ||
          !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
          !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
          !import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
        console.log('⚠️ EmailJS não configurado - simulando envio');
        console.log('💡 Configure as variáveis de ambiente VITE_EMAILJS_* no arquivo .env');
        // Simular delay do envio
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('✅ Email simulado enviado com sucesso!');
        return true;
      }

      // Envio real com EmailJS
      const result = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          to_email: `${this.BRIDE_EMAIL},${this.GROOM_EMAIL}`,
          guest_name: reservationData.guestName,
          gift_title: reservationData.giftTitle,
          message: reservationData.message || 'Nenhuma mensagem adicional',
          reservation_date: new Date(reservationData.timestamp).toLocaleString('pt-BR'),
        },
        this.PUBLIC_KEY
      );
      
      console.log('✅ Email enviado com sucesso!', result);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  static formatReservationMessage(reservationData: ReservationData): string {
    const date = new Date(reservationData.timestamp).toLocaleString('pt-BR');
    
    return `
🎁 NOVA RESERVA DE PRESENTE 🎁

Padrinho/Madrinha: ${reservationData.guestName}
Presente: ${reservationData.giftTitle}
Data da Reserva: ${date}

${reservationData.message ? `Mensagem: ${reservationData.message}` : ''}

---
Lista de Presentes dos Noivos
    `.trim();
  }
}
