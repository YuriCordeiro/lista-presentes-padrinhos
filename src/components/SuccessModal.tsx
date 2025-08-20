import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessModalProps {
  isOpen: boolean;
  giftTitle: string;
  guestName: string;
  serverAvailable: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
`;

const celebration = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.1); }
  50% { transform: rotate(5deg) scale(1.2); }
  75% { transform: rotate(-3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
`;

const Overlay = styled(motion.div)`
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
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Modal = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const IconContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  animation: ${bounce} 1s ease-in-out;
  box-shadow: 
    0 10px 30px rgba(16, 185, 129, 0.3),
    0 0 0 4px rgba(16, 185, 129, 0.1);
  
  &::after {
    content: '✓';
    animation: ${celebration} 0.8s ease-in-out 0.5s;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.6s ease-out 0.5s both;
`;

const Details = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.6s ease-out 0.7s both;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: right;
  max-width: 60%;
  word-break: break-word;
`;

const StatusBadge = styled.div<{ $success: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ $success }) => 
    $success 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  };
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.6s ease-out 0.9s both;
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.duration.normal} ${({ theme }) => theme.animations.easing.default};
  animation: ${fadeIn} 0.6s ease-out 1.1s both;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #10b981, #059669);
  border-radius: 50%;
  animation: ${celebration} 2s ease-in-out infinite;
  
  &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 20%; left: 80%; animation-delay: 0.2s; }
  &:nth-child(3) { top: 80%; left: 20%; animation-delay: 0.4s; }
  &:nth-child(4) { top: 70%; left: 90%; animation-delay: 0.6s; }
`;

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  giftTitle,
  guestName,
  serverAvailable,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ 
              duration: 0.4, 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti />
            <Confetti />
            <Confetti />
            <Confetti />
            
            <IconContainer>
              <SuccessIcon />
            </IconContainer>
            
            <Title>Presente Reservado!</Title>
            
            <Message>
              Parabéns! Sua reserva foi confirmada com sucesso. 
              Os noivos foram notificados e ficarão muito felizes com sua escolha!
            </Message>
            
            <Details>
              <DetailItem>
                <DetailLabel>Presente:</DetailLabel>
                <DetailValue>{giftTitle}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Reservado por:</DetailLabel>
                <DetailValue>{guestName}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Data:</DetailLabel>
                <DetailValue>{new Date().toLocaleDateString('pt-BR')}</DetailValue>
              </DetailItem>
            </Details>
            
            <StatusBadge $success={serverAvailable}>
              {serverAvailable ? (
                <>
                  <span>✅</span>
                  <span>Lista de presentes atualizada</span>
                </>
              ) : (
                <>
                  <span>⚠️</span>
                  <span>Reserva salva localmente</span>
                </>
              )}
            </StatusBadge>
            
            <CloseButton onClick={onClose}>
              Perfeito! ✨
            </CloseButton>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
