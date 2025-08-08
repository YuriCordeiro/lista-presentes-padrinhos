import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Header } from './components/Header';
import { GiftsGrid } from './components/GiftsGrid';
import { Footer } from './components/Footer';
import { useGifts } from './hooks/useGifts';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 50%,
    ${({ theme }) => theme.colors.background.tertiary} 100%
  );
  
  /* Subtle animated background */
  position: relative;
  overflow-x: hidden;
  
  /* Largura de 80% para desktop */
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 90%;
    max-width: none;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 80%;
  }
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function App() {
  const { gifts, loadingState, syncState } = useGifts();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      
      <LoadingOverlay loadingState={loadingState} />
      
      <AppContainer>
        <Header syncState={syncState} />
        
        <MainContent>
          <GiftsGrid gifts={gifts} loadingState={loadingState} />
        </MainContent>
        
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
