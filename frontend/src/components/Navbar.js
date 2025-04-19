import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome, FaChartLine, FaRobot, FaNetworkWired, FaDna, FaCog, FaChartBar, FaStore, FaWallet } from 'react-icons/fa';

// Import mock data
import { globalStats } from '../utils/mockData';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  
  img {
    height: 2.5rem;
    animation: pulse 4s infinite;
  }
  
  span {
    background: ${({ theme }) => theme.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 600;
    transition: color ${({ theme }) => theme.transitionSpeed} ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover, &.active {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: ${({ theme, $isActive }) => $isActive ? theme.primary : theme.textSecondary};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.backgroundTertiary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.gradientPrimary};
    transform: scaleX(${({ $isActive }) => $isActive ? 1 : 0});
    transform-origin: bottom left;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  .value {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme, status }) => status ? theme[status] : theme.text};
  }
`;

const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.primary};
    transform: rotate(90deg);
  }
`;

const WalletButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ connected, theme }) => 
    connected ? theme.success + '20' : theme.gradientPrimary};
  color: ${({ connected, theme }) => 
    connected ? theme.success : theme.text};
  border: 1px solid ${({ connected, theme }) => 
    connected ? theme.success : 'transparent'};
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .address {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const WalletModal = styled(motion.div)`
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 320px;
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  z-index: 100;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.text};
  }
  
  .wallet-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .wallet-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.backgroundTertiary};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${({ theme }) => theme.backgroundTertiary + '80'};
      transform: translateY(-2px);
    }
    
    img {
      width: 2rem;
      height: 2rem;
    }
    
    .name {
      font-weight: 500;
    }
  }
`;

const Navbar = () => {
  const location = useLocation();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const connectWallet = (walletType) => {
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x' + Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddress(mockAddress);
      setWalletConnected(true);
      setWalletModalOpen(false);
    }, 1000);
  };
  
  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletConnected(false);
  };

  const connectKeplrWallet = async () => {
    if (!window.keplr) {
      alert('Please install the Keplr extension to connect your wallet.');
      return;
    }
  
    try {
      // Enable Keplr for a specific chain (e.g., Cosmos Hub)
      const chainId = 'cosmoshub-4';
      await window.keplr.enable(chainId);
  
      // Get the offline signer and accounts
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
  
      // Set the wallet address and mark as connected
      const walletAddress = accounts[0].address;
      setWalletAddress(walletAddress);
      setWalletConnected(true);
      setWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect Keplr wallet:', error);
      alert('Failed to connect Keplr wallet. Please try again.');
    }
  };

  try {
    // Safely access mock data
    const stats = globalStats || {
      totalAgents: 0,
      activeAgents: 0,
      totalValue: 0,
      totalTrades: 0
    };
    
    return (
      <NavbarContainer>
        <Logo to="/">
          {/* Use a text fallback instead of the image to avoid potential image loading issues */}
          <span>iAgent Arena</span>
        </Logo>
        
        <NavLinks>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            <FaHome /> Dashboard
          </NavLink>
          <NavLink to="/trading" $isActive={location.pathname === '/trading'}>
            <FaChartLine /> Trading Arena
          </NavLink>
          <NavLink to="/agents" $isActive={location.pathname === '/agents'}>
            <FaRobot /> Agents
          </NavLink>
          <NavLink to="/family-tree" $isActive={location.pathname === '/family-tree'}>
            <FaNetworkWired /> Family Tree
          </NavLink>
          <NavLink to="/breeding" $isActive={location.pathname === '/breeding'}>
            <FaDna /> Breeding
          </NavLink>
        </NavLinks>
        
        <RightSection>
          <StatsContainer>
            <StatItem>
              <div className="label">TOTAL AGENTS</div>
              <div className="value">{stats.totalAgents || 0}</div>
            </StatItem>
            <StatItem>
              <div className="label">ALIVE</div>
              <div className="value status-alive">{stats.aliveAgents || 0}</div>
            </StatItem>
            <StatItem>
              <div className="label">BREEDING</div>
              <div className="value status-breeding">{stats.breedingAgents || 0}</div>
            </StatItem>
          </StatsContainer>
          
          <WalletButton 
            connected={walletConnected}
            onClick={() => walletConnected ? disconnectWallet() : setWalletModalOpen(!walletModalOpen)}
          >
            <FaWallet />
            {walletConnected ? (
              <span className="address">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
            ) : (
              "Connect Wallet"
            )}
          </WalletButton>
          
          {walletModalOpen && !walletConnected && (
            <WalletModal
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Connect Wallet</h3>
              <div className="wallet-options">
                <div className="wallet-option" onClick={() => connectWallet('metamask')}>
                  <img src="/images/metamask.png" alt="MetaMask" />
                  <span className="name">MetaMask</span>
                </div>
                <div className="wallet-option" onClick={connectKeplrWallet}>
                  <img src="/images/keplr.png" alt="Keplr" />
                  <span className="name">Keplr</span>
                </div>
                <div className="wallet-option" onClick={() => connectWallet('leap')}>
                  <img src="/images/leap.png" alt="Leap" />
                  <span className="name">Leap</span>
                </div>
                <div className="wallet-option" onClick={() => connectWallet('cosmostation')}>
                  <img src="/images/cosmostation.png" alt="Cosmostation" />
                  <span className="name">Cosmostation</span>
                </div>
              </div>
            </WalletModal>
          )}
          
          <SettingsButton>
            <FaCog />
          </SettingsButton>
        </RightSection>
      </NavbarContainer>
    );
  } catch (error) {
    console.error('Error rendering Navbar:', error);
    
    // Fallback UI in case of error
    return (
      <NavbarContainer>
        <Logo to="/">
          <span>iAgent Arena</span>
        </Logo>
        <div style={{ color: 'red', padding: '0 1rem' }}>
          Error loading navigation. Please refresh the page.
        </div>
      </NavbarContainer>
    );
  }
};

export default Navbar;
