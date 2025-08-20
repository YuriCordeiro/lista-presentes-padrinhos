import { useState, useCallback, useEffect } from 'react';
import type { Gift, ReservationData, ModalState } from '../types';
import { EmailService } from '../services/EmailService';
import { ReservationAPI } from '../services/ReservationAPI';

export const useReservations = (gifts: Gift[] = []) => {
  const [reservedGifts, setReservedGifts] = useState<Set<string>>(new Set());
  const [reservationDetails, setReservationDetails] = useState<{[key: string]: { reservedBy?: string; reservedAt?: string }}>({});
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);

  // Sincronizar com dados da planilha quando gifts mudam
  useEffect(() => {
    const reservedIds = new Set<string>();
    const details: {[key: string]: { reservedBy?: string; reservedAt?: string }} = {};

    gifts.forEach(gift => {
      if (gift.reserved) {
        reservedIds.add(gift.id);
        details[gift.id] = {
          reservedBy: gift.reservedBy,
          reservedAt: gift.reservedAt,
        };
      }
    });

    setReservedGifts(reservedIds);
    setReservationDetails(details);

    if (reservedIds.size > 0) {
      console.log(`📊 Status de reservas da planilha aplicado: ${reservedIds.size} presentes reservados`);
    }
  }, [gifts]);

  // Verificar se o servidor está disponível
  useEffect(() => {
    const checkServer = async () => {
      const isAvailable = await ReservationAPI.checkServerHealth();
      setServerAvailable(isAvailable);
      if (isAvailable) {
        console.log('✅ Servidor backend conectado - funcionalidade completa ativada');
        syncWithServer();
      } else {
        console.log('⚠️ Servidor backend não disponível - usando modo local');
      }
    };

    checkServer();
  }, []);

  // Sincronizar com servidor
  const syncWithServer = useCallback(async () => {
    if (!serverAvailable) return;

    try {
      const serverReservations = await ReservationAPI.syncReservations();
      const reservedIds = new Set<string>();
      const details: {[key: string]: { reservedBy?: string; reservedAt?: string }} = {};

      Object.entries(serverReservations).forEach(([giftId, data]) => {
        if (data.reserved) {
          reservedIds.add(giftId);
          details[giftId] = {
            reservedBy: data.reservedBy,
            reservedAt: new Date().toISOString(), // Timestamp da sincronização
          };
        }
      });

      setReservedGifts(reservedIds);
      setReservationDetails(details);
      
      console.log(`🔄 Sincronização concluída: ${reservedIds.size} presentes reservados`);
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    }
  }, [serverAvailable]);

  const openReservationModal = useCallback((gift: Gift) => {
    setModalState({
      isOpen: true,
      type: 'reservation',
      gift,
    });
  }, []);

  const openConfirmationModal = useCallback((reservationData: ReservationData) => {
    setModalState({
      isOpen: true,
      type: 'confirmation',
      reservationData,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: null,
    });
  }, []);

  const submitReservation = useCallback(async (guestName: string, message: string, gift: Gift) => {
    setIsSubmitting(true);
    
    try {
      const reservationData: ReservationData = {
        giftId: gift.id,
        giftTitle: gift.title,
        guestName: guestName.trim(),
        message: message.trim() || undefined,
        email: '', // Pode ser adicionado no futuro se necessário
        timestamp: new Date().toISOString(),
      };

      // Primeiro, mostrar o modal de confirmação
      closeModal();
      openConfirmationModal(reservationData);
      
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      alert('Erro ao processar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal, openConfirmationModal]);

  const confirmReservation = useCallback(async (reservationData: ReservationData) => {
    setIsSubmitting(true);
    
    try {
      // Enviar email
      const emailSent = await EmailService.sendReservationEmail(reservationData);
      
      if (emailSent) {
        // Marcar como reservado localmente
        setReservedGifts(prev => new Set([...prev, reservationData.giftId]));
        setReservationDetails(prev => ({
          ...prev,
          [reservationData.giftId]: {
            reservedBy: reservationData.guestName,
            reservedAt: reservationData.timestamp,
          }
        }));
        
        // Salvar no localStorage para backup
        const savedReservations = JSON.parse(localStorage.getItem('reservedGifts') || '[]');
        savedReservations.push(reservationData);
        localStorage.setItem('reservedGifts', JSON.stringify(savedReservations));
        
        // Tentar atualizar na planilha se servidor disponível
        if (serverAvailable) {
          // Buscar o presente para obter rowIndex
          const gift = modalState.gift;
          if (gift && gift.rowIndex !== undefined) {
            const apiSuccess = await ReservationAPI.reserveGift(
              reservationData.giftId,
              reservationData.giftTitle,
              reservationData.guestName,
              gift.rowIndex
            );
            
            if (apiSuccess) {
              console.log('✅ Reserva salva na planilha Google Sheets');
            } else {
              console.log('⚠️ Reserva salva localmente, mas falhou na planilha');
            }
          }
        } else {
          console.log('⚠️ Reserva salva apenas localmente (servidor não disponível)');
        }
        
        closeModal();
        
        // Mostrar sucesso
        const message = serverAvailable 
          ? '🎉 Presente reservado com sucesso! Os noivos foram notificados e a planilha foi atualizada.'
          : '🎉 Presente reservado localmente! Os noivos foram notificados por email.';
        alert(message);
      } else {
        alert('Erro ao enviar notificação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      alert('Erro ao confirmar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal, serverAvailable, modalState.gift]);

  const isGiftReserved = useCallback((giftId: string) => {
    return reservedGifts.has(giftId);
  }, [reservedGifts]);

  // Carregar reservas salvas no localStorage na inicialização
  const loadSavedReservations = useCallback(() => {
    try {
      const savedReservations = JSON.parse(localStorage.getItem('reservedGifts') || '[]');
      const giftIds = savedReservations.map((r: ReservationData) => r.giftId);
      setReservedGifts(new Set(giftIds));
    } catch (error) {
      console.error('Erro ao carregar reservas salvas:', error);
    }
  }, []);

  return {
    modalState,
    isSubmitting,
    serverAvailable,
    openReservationModal,
    closeModal,
    submitReservation,
    confirmReservation,
    isGiftReserved,
    loadSavedReservations,
    syncWithServer,
    getReservationDetails: (giftId: string) => reservationDetails[giftId],
  };
};
