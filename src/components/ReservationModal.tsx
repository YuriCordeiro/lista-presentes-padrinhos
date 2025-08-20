import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gift, ReservationData, ModalState } from '../types';

interface ReservationModalProps {
  modalState: ModalState;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmitReservation: (guestName: string, message: string, gift: Gift) => void;
  onConfirmReservation: (reservationData: ReservationData) => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.glassmorphism.background};
  backdrop-filter: ${({ theme }) => theme.glassmorphism.backdropFilter};
  border: ${({ theme }) => theme.glassmorphism.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.animations.duration.fast} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const GiftInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const GiftTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.duration.normal} ease;
  min-height: 48px;
  
  ${({ variant }) => variant === 'primary' ? `
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2d2d2d 0%, #404040 50%, #2d2d2d 100%);
      transform: translateY(-1px);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmationText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ReservationModal: React.FC<ReservationModalProps> = ({
  modalState,
  isSubmitting,
  onClose,
  onSubmitReservation,
  onConfirmReservation,
}) => {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Form submitted!', { guestName, message, gift: modalState.gift });
    if (guestName.trim() && modalState.gift) {
      console.log('✅ Calling onSubmitReservation...');
      onSubmitReservation(guestName, message, modalState.gift);
    } else {
      console.log('❌ Form validation failed', { 
        hasName: !!guestName.trim(), 
        hasGift: !!modalState.gift 
      });
    }
  };

  const handleConfirm = () => {
    console.log('🔄 Confirm button clicked!', { reservationData: modalState.reservationData });
    if (modalState.reservationData) {
      console.log('✅ Calling onConfirmReservation...');
      onConfirmReservation(modalState.reservationData);
    } else {
      console.log('❌ No reservation data found');
    }
  };

  const resetForm = () => {
    setGuestName('');
    setMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {modalState.isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {modalState.type === 'reservation' ? '🎁 Reservar Presente' : '✅ Confirmar Reserva'}
              </ModalTitle>
              <CloseButton onClick={handleClose} type="button">
                ×
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {modalState.type === 'reservation' && modalState.gift && (
                <>
                  <InfoText>
                    A reserva do presente serve para avisar os noivos que você vai comprá-lo, 
                    evitando que outros padrinhos escolham o mesmo item. Use apenas quando 
                    tiver certeza da compra, pois o item ficará indisponível para outros.
                  </InfoText>
                  
                  <GiftInfo>
                    <GiftTitle>{modalState.gift.title}</GiftTitle>
                  </GiftInfo>
                  
                  <form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label htmlFor="guestName">
                        Nome do Padrinho/Madrinha/Casal *
                      </Label>
                      <Input
                        id="guestName"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Digite seu nome completo"
                        required
                        disabled={isSubmitting}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="message">
                        Mensagem para os noivos (opcional)
                      </Label>
                      <TextArea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Deixe uma mensagem carinhosa para os noivos..."
                        disabled={isSubmitting}
                      />
                    </FormGroup>
                    
                    <ButtonGroup>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={!guestName.trim() || isSubmitting}
                      >
                        {isSubmitting ? 'Processando...' : 'Continuar'}
                      </Button>
                    </ButtonGroup>
                  </form>
                </>
              )}

              {modalState.type === 'confirmation' && modalState.reservationData && (
                <>
                  <ConfirmationText>
                    <strong>Confirmar reserva do presente:</strong><br/>
                    <GiftTitle>{modalState.reservationData.giftTitle}</GiftTitle><br/><br/>
                    
                    <strong>Padrinho/Madrinha:</strong><br/>
                    {modalState.reservationData.guestName}<br/><br/>
                    
                    {modalState.reservationData.message && (
                      <>
                        <strong>Mensagem:</strong><br/>
                        {modalState.reservationData.message}<br/><br/>
                      </>
                    )}
                    
                    Os noivos receberão um email com esta informação.
                  </ConfirmationText>
                  
                  <ButtonGroup>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button" 
                      variant="primary"
                      onClick={handleConfirm}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
                    </Button>
                  </ButtonGroup>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
