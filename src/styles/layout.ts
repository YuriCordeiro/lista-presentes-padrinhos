export const LAYOUT_CONFIG = {
  // Larguras máximas por breakpoint
  maxWidths: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1200px',
    desktopLarge: '1400px',
    desktopXL: '1600px',
    ultraWide: '1200px', // Mantém centralizado em telas muito grandes
  },
  
  // Padding lateral por breakpoint
  padding: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
    desktopLarge: '3rem',
    desktopXL: '4rem',
  },
  
  // Breakpoints de transição
  breakpoints: {
    ultraWide: '1920px',
  }
} as const;
