import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InjectiveService } from '../services/injectiveService';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const WalletButton = styled.button`
  background-color: ${props => props.connected ? '#4CAF50' : 'var(--primary-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.connected ? '#45a049' : '#5a52d5'};
  }
`;

interface HeaderProps {
  walletConnected: boolean;
  setWalletConnected: (connected: boolean) => void;
}

const Header = ({ walletConnected, setWalletConnected }: HeaderProps) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const injectiveService = InjectiveService.getInstance();

  useEffect(() => {
    // Check if wallet is already connected
    if (injectiveService.isWalletConnected()) {
      setWalletConnected(true);
      setWalletAddress(injectiveService.getAddress());
    }
  }, []);

  const handleConnectWallet = async () => {
    if (walletConnected) {
      // Disconnect wallet
      injectiveService.disconnectWallet();
      setWalletConnected(false);
      setWalletAddress('');
    } else {
      try {
        // Connect wallet
        const address = await injectiveService.connectWallet();
        setWalletConnected(true);
        setWalletAddress(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">iAgent Arena</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/arena">Agent Arena</NavLink>
          <WalletButton 
            onClick={handleConnectWallet} 
            connected={walletConnected}
          >
            {walletConnected 
              ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
              : 'Connect Wallet'}
          </WalletButton>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
