import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 1400px;
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints['2xl']}) {
    max-width: 1600px;
    padding: 0 ${({ theme }) => theme.spacing['2xl']};
  }
`;

export const WideContainer = styled(Container)`
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 1600px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints['2xl']}) {
    max-width: 1920px;
  }
`;
