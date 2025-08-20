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
  const [successModalState, setSuccessModalState] = useState<{
    isOpen: boolean;
    giftTitle: string;
    guestName: string;
  }>({
    isOpen: false,
    giftTitle: '',
    guestName: '',
  });

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

  const openSuccessModal = useCallback((giftTitle: string, guestName: string) => {
    setSuccessModalState({
      isOpen: true,
      giftTitle,
      guestName,
    });
  }, []);

  const closeSuccessModal = useCallback(() => {
    setSuccessModalState({
      isOpen: false,
      giftTitle: '',
      guestName: '',
    });
  }, []);

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
      gift: modalState.gift, // Preservar o gift do modal anterior
      reservationData,
    });
  }, [modalState.gift]);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: null,
    });
  }, []);

  const submitReservation = useCallback(async (guestName: string, message: string, gift: Gift) => {
    setIsSubmitting(true);
    
    try {
      console.log('🔄 submitReservation called with:', { guestName, message, giftTitle: gift.title });
      
      const reservationData: ReservationData = {
        giftId: gift.id,
        giftTitle: gift.title,
        guestName: guestName.trim(),
        message: message.trim() || undefined,
        email: '', // Pode ser adicionado no futuro se necessário
        timestamp: new Date().toISOString(),
      };

      console.log('📋 Reservation data prepared:', reservationData);
      
      // Abrir modal de confirmação (preservando o gift)
      console.log('✅ Opening confirmation modal...');
      openConfirmationModal(reservationData);
      
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      alert('Erro ao processar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal, openConfirmationModal]);

  const confirmReservation = useCallback(async (reservationData: ReservationData) => {
    console.log('🔄 confirmReservation called with:', reservationData);
    console.log('🔧 Server available:', serverAvailable);
    
    setIsSubmitting(true);
    
    try {
      let sheetsUpdated = false;
      
      // Tentar atualizar na planilha primeiro, se servidor disponível
      if (serverAvailable === true) {
        console.log('📊 Attempting to update spreadsheet...');
        // Buscar o presente para obter rowIndex
        const gift = modalState.gift;
        if (gift && gift.rowIndex !== undefined) {
          console.log('🎁 Gift found with rowIndex:', gift.rowIndex);
          const apiSuccess = await ReservationAPI.reserveGift(
            reservationData.giftId,
            reservationData.giftTitle,
            reservationData.guestName,
            gift.rowIndex
          );
          
          if (apiSuccess) {
            console.log('✅ Reserva salva na planilha Google Sheets');
            sheetsUpdated = true;
          } else {
            console.log('⚠️ Falhou ao atualizar a planilha');
            alert('Erro ao atualizar a planilha. Tente novamente.');
            return;
          }
        } else {
          console.log('❌ Gift not found or missing rowIndex');
          alert('Erro: dados do presente não encontrados.');
          return;
        }
      } else if (serverAvailable === false) {
        console.log('⚠️ Servidor não disponível - não é possível atualizar a planilha');
        alert('Servidor não disponível. Não é possível completar a reserva no momento.');
        return;
      } else {
        console.log('🔄 Servidor ainda não verificado, tentando mesmo assim...');
        // Tentar mesmo com servidor em estado desconhecido
        const gift = modalState.gift;
        if (gift && gift.rowIndex !== undefined) {
          console.log('🎁 Gift found with rowIndex:', gift.rowIndex);
          const apiSuccess = await ReservationAPI.reserveGift(
            reservationData.giftId,
            reservationData.giftTitle,
            reservationData.guestName,
            gift.rowIndex
          );
          
          if (apiSuccess) {
            console.log('✅ Reserva salva na planilha Google Sheets');
            sheetsUpdated = true;
          } else {
            console.log('⚠️ Falhou ao atualizar a planilha');
            alert('Erro ao atualizar a planilha. Tente novamente.');
            return;
          }
        } else {
          console.log('❌ Gift not found or missing rowIndex');
          alert('Erro: dados do presente não encontrados.');
          return;
        }
      }
      
      // Só enviar email se a planilha foi atualizada com sucesso
      if (sheetsUpdated) {
        const emailSent = await EmailService.sendReservationEmail(reservationData);
        
        if (emailSent) {
          console.log('✅ Email de notificação enviado com sucesso');
        } else {
          console.log('⚠️ Planilha atualizada, mas email falhou');
          // Mesmo assim continuamos, pois a planilha foi atualizada
        }
        
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
        
        closeModal();
        
        // Mostrar modal de sucesso
        openSuccessModal(reservationData.giftTitle, reservationData.guestName);
      }
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      alert('Erro ao confirmar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal, serverAvailable, modalState.gift, openSuccessModal]);

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
    successModalState,
    openReservationModal,
    closeModal,
    openSuccessModal,
    closeSuccessModal,
    submitReservation,
    confirmReservation,
    isGiftReserved,
    loadSavedReservations,
    syncWithServer,
    getReservationDetails: (giftId: string) => reservationDetails[giftId],
  };
};
