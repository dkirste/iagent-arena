import React, { createContext, useState, useContext, useEffect } from 'react';
import { connectKeplrWallet, getAgentTokenBalance, getTokenPrice } from '../utils/wallet';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenPrice, setTokenPrice] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect to Keplr wallet
  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { address } = await connectKeplrWallet();
      setWalletAddress(address);
      setIsConnected(true);
      
      // Get initial token balance and price
      await refreshData(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setWalletAddress('');
    setIsConnected(false);
    setTokenBalance('0');
    setTokenPrice('0');
  };

  // Refresh token balance and price
  const refreshData = async (address = walletAddress) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Get token balance
      const balance = await getAgentTokenBalance(address);
      setTokenBalance(balance);
      
      // Get token price
      const price = await getTokenPrice();
      setTokenPrice(price);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.keplr) {
        try {
          await connect();
        } catch (error) {
          console.log('No wallet connected:', error);
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        tokenBalance,
        tokenPrice,
        isLoading,
        error,
        connect,
        disconnect,
        refreshData
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
