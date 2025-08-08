import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.glassmorphism.background};
  backdrop-filter: ${({ theme }) => theme.glassmorphism.backdropFilter};
  border-top: ${({ theme }) => theme.glassmorphism.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  margin-top: auto;
  text-align: center;
`;

const FooterContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const HeartIcon = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
  margin: 0 ${({ theme }) => theme.spacing.xs};
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <FooterMessage>
          <HeartIcon>💝</HeartIcon>
          Com amor, Carol e Yuri
        </FooterMessage>
      </FooterContent>
    </FooterContainer>
  );
};
