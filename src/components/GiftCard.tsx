import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Gift } from '../types';

interface GiftCardProps {
  gift: Gift;
  index: number;
}

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.glassmorphism.background};
  backdrop-filter: ${({ theme }) => theme.glassmorphism.backdropFilter};
  border: ${({ theme }) => theme.glassmorphism.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.animations.duration.normal} ${({ theme }) => theme.animations.easing.default};
  width: 100%;
  max-width: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 400px;
    margin: 0 auto;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.tertiary};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 240px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    height: 280px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints['2xl']}) {
    height: 300px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
  padding: ${({ theme }) => theme.spacing.sm};
  transition: transform ${({ theme }) => theme.animations.duration.normal} ${({ theme }) => theme.animations.easing.default};
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ProductTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.3;
  margin: 0;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.animations.duration.normal} ${({ theme }) => theme.animations.easing.default};
  text-align: center;
  min-height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #2d2d2d 0%, #404040 50%, #2d2d2d 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }
`;

export const GiftCard: React.FC<GiftCardProps> = ({ gift, index }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <ImageContainer>
        <ProductImage 
          src={gift.imageUrl} 
          alt={gift.title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </ImageContainer>
      
      <CardContent>
        <ProductTitle>{gift.title}</ProductTitle>
        
        <ActionButton 
          href={gift.productUrl} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Ver Produto <span role="img" aria-label="gift">🎁</span>
        </ActionButton>
      </CardContent>
    </Card>
  );
};
