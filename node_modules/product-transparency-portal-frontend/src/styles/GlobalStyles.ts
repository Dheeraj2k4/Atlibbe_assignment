import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding: 2rem 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button {
    cursor: pointer;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      padding: 0 2rem;
    }
  }

  .section {
    padding: 4rem 0;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      padding: 6rem 0;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;