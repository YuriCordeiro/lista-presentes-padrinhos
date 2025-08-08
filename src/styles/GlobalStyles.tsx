import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (min-width: 1280px) {
      font-size: 17px;
    }
    
    @media (min-width: 1536px) {
      font-size: 18px;
    }
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.background.primary} 0%, ${({ theme }) => theme.colors.background.secondary} 100%);
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.tertiary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.muted};
  }
  
  /* Focus styles */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
  
  /* Link styles */
  a {
    color: inherit;
    text-decoration: none;
  }
  
  /* Button reset */
  button {
    background: none;
    border: none;
    font-family: inherit;
    cursor: pointer;
  }
  
  /* Image optimization */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: 1.2;
    margin: 0;
  }
  
  p {
    margin: 0;
  }
  
  /* Animations */
  .fade-in {
    animation: fadeIn ${({ theme }) => theme.animations.duration.slow} ${({ theme }) => theme.animations.easing.default};
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .slide-up {
    animation: slideUp ${({ theme }) => theme.animations.duration.normal} ${({ theme }) => theme.animations.easing.default};
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Loading spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  /* Pulse animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
  
  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* Mobile optimizations */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    html {
      font-size: 14px;
    }
    
    body {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: #000000;
      color: #ffffff;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
