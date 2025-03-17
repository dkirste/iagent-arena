import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Roboto', sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    overflow-x: hidden;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollThumb};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.scrollThumbHover};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .glow {
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.primary});
  }

  .breeding-animation {
    animation: breeding 3s infinite alternate;
  }

  @keyframes breeding {
    0% {
      filter: drop-shadow(0 0 5px ${({ theme }) => theme.primary});
    }
    100% {
      filter: drop-shadow(0 0 20px ${({ theme }) => theme.primary});
    }
  }
`;

export default GlobalStyle;
