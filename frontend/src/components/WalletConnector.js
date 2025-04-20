import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaWallet, FaSignOutAlt, FaRedoAlt } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';

const Spinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const WalletButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme, connected }) => connected ? theme.backgroundTertiary : theme.primary};
  color: ${({ theme, connected }) => connected ? theme.text : theme.textInverted};
  border: 1px solid ${({ theme, connected }) => connected ? theme.border : 'transparent'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, connected }) => connected ? theme.backgroundSecondary : theme.primaryHover};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const WalletModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.textSecondary};
    cursor: pointer;
    font-size: 1.25rem;
    
    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
  
  .address {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.textSecondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const BalanceCard = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .label {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  .value {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .secondary {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme, variant }) => 
    variant === 'primary' ? theme.primary : 
    variant === 'danger' ? theme.danger : 
    theme.backgroundTertiary};
  color: ${({ theme, variant }) => 
    variant === 'primary' || variant === 'danger' ? theme.textInverted : theme.text};
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'primary' ? theme.primaryHover : 
      variant === 'danger' ? theme.dangerHover : 
      theme.backgroundSecondary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.danger};
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  
  .spinner {
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ConnectButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textInverted};
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ConnectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const AddressDisplay = styled.div`
  font-family: monospace;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const WalletConnector = () => {
  const { 
    walletAddress, 
    isConnected, 
    isLoading, 
    connect, 
    disconnect, 
    refreshData 
  } = useWallet();
  

  
  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <WalletContainer>
      {!isConnected ? (
        <ConnectButton 
          onClick={connect}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
          <FaWallet style={{ marginLeft: '8px' }} />
        </ConnectButton>
      ) : (
        <ConnectedContainer>
          <AddressDisplay>
            {formatWalletAddress(walletAddress)}
          </AddressDisplay>
          
          <ButtonGroup>
            <ActionButton 
              onClick={refreshData}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Refresh Data"
            >
              <FaRedoAlt />
            </ActionButton>
            
            <ActionButton 
              onClick={disconnect}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Disconnect Wallet"
            >
              <FaSignOutAlt />
            </ActionButton>
          </ButtonGroup>
        </ConnectedContainer>
      )}
    </WalletContainer>
  );
};

export default WalletConnector;
