import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import { buyTokens, sellTokens } from '../utils/wallet';

const TradingContainer = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TradingHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TradingContent = styled.div`
  padding: 1.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme, active }) => active ? theme.backgroundSecondary : 'transparent'};
  border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.border};
  border-radius: 0.5rem;
  color: ${({ theme, active }) => active ? theme.primary : theme.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, active }) => active ? theme.backgroundSecondary : theme.backgroundTertiary};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  label {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const InputContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  overflow: hidden;
  
  input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    outline: none;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &[type=number] {
      -moz-appearance: textfield;
    }
  }
  
  .input-suffix {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    background: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 600;
    border-left: 1px solid ${({ theme }) => theme.border};
  }
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      color: ${({ theme }) => theme.textSecondary};
      font-size: 0.875rem;
    }
    
    .value {
      font-weight: 600;
    }
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
    variant === 'buy' ? theme.secondary : 
    variant === 'sell' ? theme.danger : 
    theme.primary};
  color: ${({ theme }) => theme.textInverted};
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'buy' ? 'rgba(16, 185, 129, 0.8)' : 
      variant === 'sell' ? 'rgba(239, 68, 68, 0.8)' : 
      theme.primaryHover};
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
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.secondary};
  background: rgba(16, 185, 129, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 1rem;
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AgentTokenTrading = () => {
  const {
    walletAddress,
    isConnected,
    tokenBalance,
    tokenPrice,
    refreshData
  } = useWallet();
  
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState('');
  const [estimatedInj, setEstimatedInj] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Format token amount helper function
  const formatTokenAmount = (amount, decimals = 6) => {
    if (!amount) return '0';
    const value = parseFloat(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
  };
  
  // Parse token price (convert from smallest unit)
  const parsedTokenPrice = parseFloat(tokenPrice) / 10**18;
  
  // Calculate estimated tokens based on INJ amount (for buy)
  useEffect(() => {
    if (activeTab === 'buy' && amount) {
      try {
        const injAmount = parseFloat(amount);
        const estimatedAmount = (injAmount / parsedTokenPrice).toFixed(6);
        setEstimatedTokens(estimatedAmount);
      } catch (error) {
        console.error('Error calculating estimated tokens:', error);
        setEstimatedTokens('0');
      }
    }
  }, [activeTab, amount, parsedTokenPrice]);
  
  // Calculate estimated INJ based on token amount (for sell)
  useEffect(() => {
    if (activeTab === 'sell' && amount) {
      try {
        const tokenAmount = parseFloat(amount);
        const estimatedAmount = (tokenAmount * parsedTokenPrice).toFixed(6);
        setEstimatedInj(estimatedAmount);
      } catch (error) {
        console.error('Error calculating estimated INJ:', error);
        setEstimatedInj('0');
      }
    }
  }, [activeTab, amount, parsedTokenPrice]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAmount('');
    setError(null);
    setSuccess('');
  };
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleMaxClick = () => {
    if (activeTab === 'buy') {
      setAmount('1');
    } else {
      if (tokenBalance) {
        const maxTokens = formatTokenAmount(tokenBalance, 6);
        setAmount(maxTokens.replace(/,/g, ''));
      }
    }
  };
  
  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert amount to the smallest unit (10^18 for INJ)
      const amountInSmallestUnit = (parseFloat(amount) * 10**18).toString();
      
      // Execute buy transaction
      const result = await buyTokens(walletAddress, amountInSmallestUnit);
      console.log('Buy transaction result:', result);
      
      // Clear input and refresh data
      setAmount('');
      await refreshData();
      
      // Set success message
      setSuccess(`Successfully bought tokens! Tx: ${result.txHash}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error buying tokens:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSell = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!tokenBalance || parseFloat(amount) > parseFloat(tokenBalance) / 10**6) {
      setError('Insufficient token balance');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert amount to the smallest unit (10^6 for tokens)
      const amountInSmallestUnit = (parseFloat(amount) * 10**6).toString();
      
      // Execute sell transaction
      const result = await sellTokens(walletAddress, amountInSmallestUnit);
      console.log('Sell transaction result:', result);
      
      // Clear input and refresh data
      setAmount('');
      await refreshData();
      
      // Set success message
      setSuccess(`Successfully sold tokens! Tx: ${result.txHash}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error selling tokens:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <TradingContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TradingHeader>
        <h3>
          <FaChartLine /> Agent Token Trading
        </h3>
      </TradingHeader>
      
      <TradingContent>
        {!isConnected ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p>Connect your wallet to trade agent tokens</p>
          </div>
        ) : (
          <>
            <TabsContainer>
              <Tab 
                active={activeTab === 'buy'} 
                onClick={() => handleTabChange('buy')}
              >
                Buy Tokens
              </Tab>
              <Tab 
                active={activeTab === 'sell'} 
                onClick={() => handleTabChange('sell')}
              >
                Sell Tokens
              </Tab>
            </TabsContainer>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <FormGroup>
              <label>
                {activeTab === 'buy' ? 'Amount to spend (INJ)' : 'Amount to sell (Tokens)'}
              </label>
              <InputContainer>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isProcessing}
                />
                <div className="input-suffix" onClick={handleMaxClick} style={{ cursor: 'pointer' }}>
                  MAX
                </div>
              </InputContainer>
            </FormGroup>
            
            <InfoBox>
              <div className="info-row">
                <div className="label">Current Price</div>
                <div className="value">
                  {parsedTokenPrice.toFixed(6)} INJ per token
                </div>
              </div>
              
              <div className="info-row">
                <div className="label">Your Balance</div>
                <div className="value">
                  {parseFloat(tokenBalance) / 10**6} Tokens
                </div>
              </div>
              
              {activeTab === 'buy' ? (
                <div className="info-row">
                  <div className="label">Estimated Tokens</div>
                  <div className="value">
                    {amount ? `~${estimatedTokens} Tokens` : '-'}
                  </div>
                </div>
              ) : (
                <div className="info-row">
                  <div className="label">Estimated INJ</div>
                  <div className="value">
                    {amount ? `~${estimatedInj} INJ` : '-'}
                  </div>
                </div>
              )}
              

            </InfoBox>
            
            {activeTab === 'buy' ? (
              <ActionButton
                variant="buy"
                onClick={handleBuy}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Tokens
              </ActionButton>
            ) : (
              <ActionButton
                variant="sell"
                onClick={handleSell}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sell Tokens
              </ActionButton>
            )}
            
            {isProcessing && (
              <LoadingOverlay>
                <div className="spinner" />
              </LoadingOverlay>
            )}
          </>
        )}
      </TradingContent>
    </TradingContainer>
  );
};

export default AgentTokenTrading;
