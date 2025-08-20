import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftCard } from './GiftCard';
import { ReservationModal } from './ReservationModal';
import { useReservations } from '../hooks/useReservations';
import type { Gift, LoadingState } from '../types';

interface GiftsGridProps {
  gifts: Gift[];
  loadingState: LoadingState;
}

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
    max-width: 90%;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 85%;
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  }
`;

const SectionTitle = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints['2xl']}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.glassmorphism.background};
  backdrop-filter: ${({ theme }) => theme.glassmorphism.backdropFilter};
  border: ${({ theme }) => theme.glassmorphism.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.8;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const EmptyDecorations = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 1.5rem;
  opacity: 0.6;
`;

const LoadingIndicator = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const GiftsGrid: React.FC<GiftsGridProps> = ({ gifts, loadingState }) => {
  const {
    modalState,
    isSubmitting,
    openReservationModal,
    closeModal,
    submitReservation,
    confirmReservation,
    isGiftReserved,
    loadSavedReservations,
  } = useReservations();

  // Carregar reservas salvas na inicialização
  useEffect(() => {
    loadSavedReservations();
  }, [loadSavedReservations]);

  const showEmptyState = gifts.length === 0 && !loadingState.isLoading;
  const showLoadingIndicator = gifts.length === 0 && loadingState.isLoading;

  return (
    <Section>
      <SectionTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Title>Nossos Presentes Especiais</Title>
      </SectionTitle>

      <AnimatePresence mode="wait">
        {showEmptyState && (
          <EmptyState
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyIcon>💝</EmptyIcon>
            <EmptyTitle>Lista sendo preparada com carinho</EmptyTitle>
            <EmptyDescription>
              Estamos carregando e validando as imagens dos produtos. 
              Só exibimos presentes com fotos válidas para garantir a melhor experiência!
            </EmptyDescription>
            <EmptyDecorations>
              <span>✨</span>
              <span>♥</span>
              <span>✨</span>
            </EmptyDecorations>
          </EmptyState>
        )}

        {showLoadingIndicator && (
          <LoadingIndicator
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>Carregando presentes...</p>
          </LoadingIndicator>
        )}

        {gifts.length > 0 && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Grid>
              {gifts.map((gift, index) => (
                <GiftCard 
                  key={gift.id} 
                  gift={gift} 
                  index={index}
                  isReserved={isGiftReserved(gift.id)}
                  onReserve={openReservationModal}
                />
              ))}
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      <ReservationModal
        modalState={modalState}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmitReservation={submitReservation}
        onConfirmReservation={confirmReservation}
      />
    </Section>
  );
};
