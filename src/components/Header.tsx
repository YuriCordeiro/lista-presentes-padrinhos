import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { SyncState } from '../types';

interface HeaderProps {
  syncState: SyncState;
}

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.glassmorphism.background};
  backdrop-filter: ${({ theme }) => theme.glassmorphism.backdropFilter};
  border-bottom: ${({ theme }) => theme.glassmorphism.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  }
`;

const HeaderContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 90%;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 85%;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const WelcomeSection = styled(motion.div)`
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const WelcomeDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const InstructionText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  span {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

const VoltageWarning = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.status.warning};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: rgba(245, 158, 11, 0.1);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.status.warning};
  
  strong {
    color: ${({ theme }) => theme.colors.status.warning};
  }
`;

const SyncIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const SyncDot = styled.div<{ status: SyncState['syncStatus']; isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ status, isOnline, theme }) => {
    if (!isOnline) return theme.colors.status.error;
    switch (status) {
      case 'success': return theme.colors.status.success;
      case 'syncing': return theme.colors.status.info;
      case 'error': return theme.colors.status.error;
      default: return theme.colors.text.muted;
    }
  }};
  
  ${({ status }) => status === 'syncing' && `
    animation: pulse 2s ease-in-out infinite;
  `}
`;

const getSyncText = (syncState: SyncState): string => {
  if (!syncState.isOnline) return 'Modo offline';
  
  switch (syncState.syncStatus) {
    case 'syncing': return 'Sincronizando...';
    case 'success': return 'Lista atualizada automaticamente';
    case 'error': return 'Erro na sincronização';
    default: return 'Aguardando sincronização';
  }
};

export const Header: React.FC<HeaderProps> = ({ syncState }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <WelcomeSection
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeTitle>Olá padrinho! 👑</WelcomeTitle>
          
          <WelcomeDescription>
            Caso você prefira, criamos essa <strong>Lista de Presentes Personalizada</strong> para facilitar as escolhas de vocês!
          </WelcomeDescription>
          
          <InstructionText>
            Basta clicar em <span>"Ver Produto"</span> para ser redirecionado para o link do produto!
          </InstructionText>
          
          <VoltageWarning>
            ⚡ Todos os itens que usam energia elétrica devem ser <strong>127V</strong>
          </VoltageWarning>
        </WelcomeSection>
        
        <SyncIndicator>
          <SyncDot status={syncState.syncStatus} isOnline={syncState.isOnline} />
          <span>{getSyncText(syncState)}</span>
        </SyncIndicator>
      </HeaderContent>
    </HeaderContainer>
  );
};
