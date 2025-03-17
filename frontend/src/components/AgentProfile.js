import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTwitter, FaTelegram, FaDiscord, FaChartLine, FaExchangeAlt, FaNetworkWired, FaRobot, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Mock data
import { agents, tradingActivities, agentRelationships } from '../utils/mockData';
import AgentAnalytics from './AgentAnalytics';

const ProfileContainer = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.textSecondary};
  width: fit-content;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateX(-5px);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  .avatar-container {
    position: relative;
    width: 150px;
    height: 150px;
    
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid ${({ theme, status }) => theme[status] || theme.border};
      ${({ status, theme }) => status === 'breeding' && `
        animation: glow 2s infinite;
        box-shadow: 0 0 20px ${theme.breeding};
      `}
    }
    
    .status-indicator {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: ${({ theme, status }) => 
        status === 'alive' ? theme.alive : 
        status === 'breeding' ? theme.breeding : 
        theme.danger};
      border: 3px solid ${({ theme }) => theme.backgroundSecondary};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
    }
  }
  
  .social-links {
    display: flex;
    gap: 0.75rem;
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: ${({ theme }) => theme.backgroundTertiary};
      color: ${({ theme }) => theme.textSecondary};
      transition: all ${({ theme }) => theme.transitionSpeed} ease;
      
      &:hover {
        background: ${({ theme }) => theme.primary};
        color: white;
        transform: translateY(-3px);
      }
    }
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  .agent-name {
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .gen-badge {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      background: ${({ theme, gen }) => theme[`gen${gen}`] || theme.primary};
      color: white;
    }
  }
  
  .agent-id {
    font-size: 1rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  .agent-traits {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    
    .trait {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.25rem;
      background: ${({ theme }) => theme.backgroundTertiary};
      color: ${({ theme }) => theme.textSecondary};
      font-weight: 500;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    
    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      
      .stat-label {
        font-size: 0.75rem;
        color: ${({ theme }) => theme.textSecondary};
      }
      
      .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${({ theme }) => theme.text};
        
        &.address {
          font-size: 0.875rem;
          font-family: monospace;
          background: ${({ theme }) => theme.backgroundTertiary};
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
`;

const ProgressSection = styled.div`
  margin-top: 1rem;
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    .label {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.textSecondary};
    }
    
    .value {
      font-size: 0.75rem;
      font-weight: 600;
      color: ${({ theme, status }) => 
        status === 'breeding' ? theme.breeding :
        status === 'alive' ? theme.alive :
        theme.danger
      };
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 0.25rem;
    overflow: hidden;
    
    .progress {
      height: 100%;
      width: ${({ progress }) => `${Math.min(100, progress)}%`};
      background: ${({ theme, status }) => 
        status === 'breeding' ? theme.breeding :
        status === 'alive' ? theme.alive :
        theme.danger
      };
      border-radius: 0.25rem;
      transition: width 0.5s ease;
    }
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  color: ${({ theme, active }) => active ? theme.primary : theme.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.primary : 'transparent'};
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const TabContent = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const TradingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.backgroundTertiary};
  }
  
  th {
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    background-color: ${({ theme }) => theme.backgroundSecondary};
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  tr:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
  
  td.buy, td.sell {
    font-weight: 600;
  }
  
  td.buy {
    color: ${({ theme }) => theme.alive};
  }
  
  td.sell {
    color: ${({ theme }) => theme.danger};
  }
  
  td.positive {
    color: ${({ theme }) => theme.alive};
  }
  
  td.negative {
    color: ${({ theme }) => theme.danger};
  }
  
  td.status-success {
    color: ${({ theme }) => theme.alive};
  }
  
  td.status-failed {
    color: ${({ theme }) => theme.danger};
  }
  
  tbody tr:nth-child(even) {
    background-color: ${({ theme }) => theme.backgroundSecondary + '33'};
  }
  
  tbody tr:first-child {
    animation: highlight 2s ease-out;
  }
  
  @keyframes highlight {
    0% {
      background-color: ${({ theme }) => theme.primary + '33'};
    }
    100% {
      background-color: transparent;
    }
  }
`;

const RelationshipsContainer = styled.div`
  padding: 1.5rem;
  
  .relationships-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .relationships-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const RelationshipCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.5rem;
  border-left: 4px solid ${({ theme, type }) => 
    type === 'parent' ? theme.primary : 
    type === 'child' ? theme.secondary : 
    theme.accent};
  
  .agent-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .agent-info {
    flex: 1;
    
    .agent-name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .gen {
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: ${({ theme, gen }) => theme[`gen${gen}`] || theme.primary};
        color: white;
      }
    }
    
    .relationship-type {
      font-size: 0.875rem;
      color: ${({ theme, type }) => 
        type === 'parent' ? theme.primary : 
        type === 'child' ? theme.secondary : 
        theme.accent};
      font-weight: 500;
    }
    
    .token-value {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.textSecondary};
      margin-top: 0.25rem;
    }
  }
`;

const StrategyContainer = styled.div`
  padding: 1.5rem;
  
  .strategy-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .strategy-description {
    line-height: 1.6;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 2rem;
  }
  
  .strategy-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    .stat-card {
      background: ${({ theme }) => theme.backgroundTertiary};
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      .stat-label {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.textSecondary};
      }
      
      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${({ theme }) => theme.text};
      }
    }
  }
  
  .strategy-parameters {
    background: ${({ theme }) => theme.backgroundTertiary};
    border-radius: 0.5rem;
    padding: 1.5rem;
    
    .parameters-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .parameters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      
      .parameter {
        display: flex;
        justify-content: space-between;
        
        .param-name {
          font-size: 0.875rem;
          color: ${({ theme }) => theme.textSecondary};
        }
        
        .param-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: ${({ theme }) => theme.text};
        }
      }
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .message {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text};
  }
  
  .sub-message {
    font-size: 1rem;
    color: ${({ theme }) => theme.textSecondary};
    max-width: 500px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.backgroundTertiary};
    border-top: 4px solid ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  .text {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AgentProfile = ({ selectedAgent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trades');
  const [liveAgent, setLiveAgent] = useState(null);
  const [liveTrades, setLiveTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get agent data from ID
  const agentId = id ? parseInt(id) : null;
  const initialAgent = selectedAgent || (agentId ? agents.find(a => a.id === agentId) : null);
  
  // Initialize live agent data
  useEffect(() => {
    try {
      setIsLoading(true);
      
      if (initialAgent) {
        // Create a safe copy of the agent with default values for missing properties
        const safeAgent = {
          id: initialAgent.id || 0,
          name: initialAgent.name || 'Unknown Agent',
          avatar: initialAgent.avatar || null,
          status: initialAgent.status || 'unknown',
          generation: initialAgent.generation || 1,
          tokenValue: initialAgent.tokenValue || 0,
          walletBalance: initialAgent.walletBalance || 0,
          marketCap: initialAgent.marketCap || 0,
          healthPoints: initialAgent.healthPoints || 0,
          tokenAddress: initialAgent.tokenAddress || '0x0000000000000000000000000000000000000000',
          walletAddress: initialAgent.walletAddress || '0x0000000000000000000000000000000000000000',
          breedProgress: initialAgent.breedProgress || 0,
          traits: Array.isArray(initialAgent.traits) ? initialAgent.traits : ['Adaptive'],
          twitter: initialAgent.twitter || '#',
          telegram: initialAgent.telegram || '#',
          discord: initialAgent.discord || '#',
          ...initialAgent
        };
        
        setLiveAgent({
          ...safeAgent,
          tokenValueTrend: 'up',
          walletBalanceTrend: 'up',
          marketCapTrend: 'up'
        });
        
        // Get agent's trades
        const agentTrades = tradingActivities ? 
          tradingActivities.filter(trade => trade.agentId === initialAgent.id) : 
          [];
          
        setLiveTrades(agentTrades);
      } else {
        setError('Agent not found');
      }
    } catch (err) {
      console.error('Error initializing agent data:', err);
      setError('Failed to load agent data');
    } finally {
      setIsLoading(false);
    }
  }, [initialAgent]);
  
  // Simulate live data updates
  useEffect(() => {
    if (!liveAgent) return;
    
    try {
      const updateInterval = setInterval(() => {
        // Update agent stats
        setLiveAgent(prevAgent => {
          if (!prevAgent) return prevAgent;
          
          try {
            // Random fluctuation between -3% and +3%
            const tokenValueChange = prevAgent.tokenValue * (Math.random() * 0.06 - 0.03);
            const walletBalanceChange = prevAgent.walletBalance * (Math.random() * 0.04 - 0.02);
            const marketCapChange = prevAgent.marketCap * (Math.random() * 0.05 - 0.025);
            
            // Update values
            const newTokenValue = Math.max(10, prevAgent.tokenValue + tokenValueChange);
            const newWalletBalance = Math.max(100, prevAgent.walletBalance + walletBalanceChange);
            const newMarketCap = Math.max(1000, prevAgent.marketCap + marketCapChange);
            
            // Calculate new breed progress
            const breedThreshold = 10000;
            const newBreedProgress = Math.min(100, Math.floor((newTokenValue / breedThreshold) * 100));
            
            // Add change indicators
            const tokenValueTrend = tokenValueChange > 0 ? 'up' : 'down';
            const walletBalanceTrend = walletBalanceChange > 0 ? 'up' : 'down';
            const marketCapTrend = marketCapChange > 0 ? 'up' : 'down';
            
            return {
              ...prevAgent,
              tokenValue: newTokenValue,
              walletBalance: newWalletBalance,
              marketCap: newMarketCap,
              breedProgress: newBreedProgress,
              tokenValueTrend,
              walletBalanceTrend,
              marketCapTrend
            };
          } catch (err) {
            console.error('Error updating agent data:', err);
            return prevAgent;
          }
        });
        
        // Update trades with random price changes
        setLiveTrades(prevTrades => {
          if (!prevTrades || !Array.isArray(prevTrades)) return [];
          
          try {
            return prevTrades.map(trade => {
              if (!trade) return trade;
              
              const priceChange = trade.price * (Math.random() * 0.04 - 0.02);
              const newPrice = Math.max(0.01, trade.price + priceChange);
              const newChange = (priceChange / trade.price) * 100;
              
              return {
                ...trade,
                price: newPrice,
                change: newChange
              };
            });
          } catch (err) {
            console.error('Error updating trade data:', err);
            return prevTrades;
          }
        });
      }, 3000); // Update every 3 seconds
      
      return () => clearInterval(updateInterval);
    } catch (err) {
      console.error('Error setting up data simulation:', err);
    }
  }, [liveAgent]);

  const generateRealisticTrades = (agentId) => {
    const tokens = ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC', 'DOT', 'ADA', 'LINK', 'UNI', 'AAVE', 'COMP', 'SNX', 'MKR', 'YFI', 'INJ', 'ATOM', 'OSMO', 'JUNO', 'STARS', 'AKT'];
    const dexs = ['Helix', 'Dojo Swap'];
    const strategies = ['Market Making', 'Arbitrage', 'Trend Following', 'Mean Reversion', 'Breakout', 'Momentum', 'Scalping'];
    
    // Current timestamp
    const now = new Date().getTime();
    
    // Generate 20 trades with realistic data
    return Array(20).fill().map((_, i) => {
      // Random token pair
      const baseToken = tokens[Math.floor(Math.random() * tokens.length)];
      let quoteToken;
      do {
        quoteToken = tokens[Math.floor(Math.random() * tokens.length)];
      } while (quoteToken === baseToken);
      
      const pair = `${baseToken}/${quoteToken}`;
      
      // Random trade type (buy or sell)
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      
      // Random amount with 4 decimal places
      const amount = (Math.random() * 10 + 0.1).toFixed(4);
      
      // Random price with realistic values
      let price;
      if (baseToken === 'BTC') {
        price = (Math.random() * 10000 + 30000).toFixed(2);
      } else if (baseToken === 'ETH') {
        price = (Math.random() * 1000 + 1500).toFixed(2);
      } else if (baseToken === 'INJ') {
        price = (Math.random() * 20 + 20).toFixed(2);
      } else {
        price = (Math.random() * 100 + 1).toFixed(2);
      }
      
      // Calculate total value
      const value = (parseFloat(amount) * parseFloat(price)).toFixed(2);
      
      // Random timestamp within the last 24 hours
      const timestamp = new Date(now - Math.random() * 24 * 60 * 60 * 1000);
      
      // Format timestamp as HH:MM:SS
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const seconds = timestamp.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      
      // Generate transaction hash (shortened for display)
      const txHash = '0x' + Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const shortTxHash = `${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`;
      
      // Random DEX (mostly Helix)
      const dex = Math.random() > 0.3 ? dexs[0] : dexs[1];
      
      // Random strategy
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      
      // Random success status (mostly successful)
      const status = Math.random() > 0.15 ? 'success' : 'failed';
      
      // Random profit/loss percentage
      const profitLoss = type === 'buy' ? 0 : ((Math.random() * 10) - 3).toFixed(2);
      
      return {
        id: agentId * 100 + i,
        pair,
        type,
        amount,
        price,
        value,
        time: timeString,
        txHash: shortTxHash,
        dex,
        strategy,
        status,
        profitLoss
      };
    });
  };

  const TradingActivity = ({ agent }) => {
    const [trades, setTrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    useEffect(() => {
      // Only load data once
      if (!dataLoaded && agent && agent.id) {
        setIsLoading(true);
        
        // Use a consistent seed for the random data to prevent flickering
        const generatedTrades = generateRealisticTrades(agent.id);
        
        // Simulate API call delay
        setTimeout(() => {
          setTrades(generatedTrades);
          setIsLoading(false);
          setDataLoaded(true);
        }, 1000);
      }
    }, [agent, dataLoaded]);
    
    if (isLoading) {
      return (
        <LoadingContainer>
          <div className="spinner"></div>
          <div className="text">Loading trading activity...</div>
        </LoadingContainer>
      );
    }
    
    return (
      <TradingTable>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Value</th>
            <th>DEX</th>
            <th>Strategy</th>
            <th>Tx Hash</th>
            <th>Time</th>
            <th>Status</th>
            <th>P/L %</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id} className={trade.type}>
              <td>{trade.pair}</td>
              <td className={trade.type}>{trade.type.toUpperCase()}</td>
              <td>{trade.amount}</td>
              <td>{trade.price}</td>
              <td>${trade.value}</td>
              <td>{trade.dex}</td>
              <td>{trade.strategy}</td>
              <td>
                <a 
                  href={`https://explorer.injective.network/transaction/${trade.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  {trade.txHash}
                </a>
              </td>
              <td>{trade.time}</td>
              <td className={`status-${trade.status}`}>
                {trade.status === 'success' ? 'Completed' : 'Failed'}
              </td>
              <td className={parseFloat(trade.profitLoss) >= 0 ? 'positive' : 'negative'}>
                {parseFloat(trade.profitLoss) > 0 ? '+' : ''}{trade.profitLoss}%
              </td>
            </tr>
          ))}
        </tbody>
      </TradingTable>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <ProfileContainer>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <EmptyState>
          <div className="icon">⏳</div>
          <div className="message">Loading Agent Data...</div>
          <div className="sub-message">Please wait while we fetch the latest information.</div>
        </EmptyState>
      </ProfileContainer>
    );
  }
  
  // Show error state
  if (error || !initialAgent) {
    return (
      <ProfileContainer>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <EmptyState>
          <div className="icon">🤖</div>
          <div className="message">Agent Not Found</div>
          <div className="sub-message">The agent you're looking for doesn't exist or has been deactivated.</div>
        </EmptyState>
      </ProfileContainer>
    );
  }
  
  // If live agent data not loaded yet, use initial agent data
  const agent = liveAgent || initialAgent;
  
  // Get agent's relationships - with error handling
  let relationships = [];
  
  try {
    if (agentRelationships && Array.isArray(agentRelationships)) {
      const childRelationships = agentRelationships.filter(rel => rel.parent === agent.id);
      const parentRelationships = agentRelationships.filter(rel => rel.child === agent.id);
      
      const children = childRelationships.map(rel => {
        const childAgent = agents.find(a => a.id === rel.child);
        return childAgent ? {
          ...childAgent,
          relationshipType: 'child'
        } : null;
      }).filter(Boolean);
      
      const parents = parentRelationships.map(rel => {
        const parentAgent = agents.find(a => a.id === rel.parent);
        return parentAgent ? {
          ...parentAgent,
          relationshipType: 'parent'
        } : null;
      }).filter(Boolean);
      
      relationships = [...parents, ...children];
    }
  } catch (err) {
    console.error('Error processing relationships:', err);
  }
  
  return (
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </BackButton>
      
      <ProfileHeader>
        <AvatarSection status={agent.status}>
          <div className="avatar-container">
            <img 
              src={agent.avatar || 'https://via.placeholder.com/200'} 
              alt={agent.name} 
              className="avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200';
              }}
            />
            <div className="status-indicator">
              {agent.status === 'alive' ? '✓' : agent.status === 'breeding' ? '⚡' : '✗'}
            </div>
          </div>
          
          <div className="social-links">
            <a href={agent.twitter || '#'} target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href={agent.telegram || '#'} target="_blank" rel="noopener noreferrer">
              <FaTelegram />
            </a>
            <a href={agent.discord || '#'} target="_blank" rel="noopener noreferrer">
              <FaDiscord />
            </a>
          </div>
        </AvatarSection>
        
        <InfoSection gen={agent.generation}>
          <div>
            <div className="agent-name">
              {agent.name}
              <span className="gen-badge">GEN_{agent.generation}</span>
            </div>
            <div className="agent-id">Agent #{agent.id} • Created 3 months ago</div>
            
            <div className="agent-traits">
              {agent.traits && Array.isArray(agent.traits) && agent.traits.map((trait, index) => (
                <div key={index} className="trait">{trait}</div>
              ))}
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-label">TOKEN VALUE</div>
              <div className="stat-value">
                ${agent.tokenValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {agent.tokenValueTrend && (
                  <span style={{ 
                    color: agent.tokenValueTrend === 'up' ? '#10B981' : '#EF4444',
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {agent.tokenValueTrend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-label">WALLET BALANCE</div>
              <div className="stat-value">
                ${agent.walletBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {agent.walletBalanceTrend && (
                  <span style={{ 
                    color: agent.walletBalanceTrend === 'up' ? '#10B981' : '#EF4444',
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {agent.walletBalanceTrend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-label">MARKET CAP</div>
              <div className="stat-value">
                ${agent.marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {agent.marketCapTrend && (
                  <span style={{ 
                    color: agent.marketCapTrend === 'up' ? '#10B981' : '#EF4444',
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {agent.marketCapTrend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-label">HEALTH POINTS</div>
              <div className="stat-value">
                {agent.healthPoints > 0 ? agent.healthPoints : '💀'}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-label">TOKEN ADDRESS</div>
              <div className="stat-value address">{agent.tokenAddress || '0x0000'}</div>
            </div>
            
            <div className="stat">
              <div className="stat-label">WALLET ADDRESS</div>
              <div className="stat-value address">{agent.walletAddress || '0x0000'}</div>
            </div>
          </div>
          
          <ProgressSection progress={agent.breedProgress || 0} status={agent.status}>
            <div className="progress-label">
              <div className="label">
                {agent.status === 'breeding' ? 'BREEDING PROGRESS' : 'NEXT GEN THRESHOLD'}
              </div>
              <div className="value">{agent.breedProgress || 0}%</div>
            </div>
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </ProgressSection>
        </InfoSection>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'trades' ? 1 : 0}
          onClick={() => setActiveTab('trades')}
        >
          <FaExchangeAlt /> Trading Activity
        </Tab>
        <Tab 
          active={activeTab === 'relationships' ? 1 : 0}
          onClick={() => setActiveTab('relationships')}
        >
          <FaNetworkWired /> Family Relationships
        </Tab>
        <Tab 
          active={activeTab === 'strategy' ? 1 : 0}
          onClick={() => setActiveTab('strategy')}
        >
          <FaRobot /> Trading Strategy
        </Tab>
        <Tab 
          active={activeTab === 'analytics' ? 1 : 0}
          onClick={() => setActiveTab('analytics')}
        >
          <FaChartLine /> Analytics
        </Tab>
      </TabsContainer>
      
      <TabContent
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'trades' && (
          <TradingActivity agent={agent} />
        )}
        
        {activeTab === 'relationships' && (
          relationships && relationships.length > 0 ? (
            <RelationshipsContainer>
              <div className="relationships-title">Family Relationships</div>
              
              <div className="relationships-grid">
                {relationships.map((rel, index) => (
                  <RelationshipCard 
                    key={index}
                    type={rel.relationshipType}
                    onClick={() => {
                      navigate(`/agent/${rel.id}`);
                    }}
                  >
                    <div className="relationship-type">
                      {rel.relationshipType === 'parent' ? 'Parent' : 'Child'}
                    </div>
                    
                    <div className="agent-info">
                      <img 
                        src={rel.avatar || 'https://via.placeholder.com/60'} 
                        alt={rel.name} 
                        className="avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/60';
                        }}
                      />
                      
                      <div>
                        <div className="name">{rel.name || 'Unknown Agent'}</div>
                        <div className="id">Agent #{rel.id || 0} • GEN_{rel.generation || 1}</div>
                      </div>
                    </div>
                    
                    <div className="stats">
                      <div className="stat">
                        <div className="label">TOKEN VALUE</div>
                        <div className="value">${(rel.tokenValue || 0).toLocaleString()}</div>
                      </div>
                      
                      <div className="stat">
                        <div className="label">STATUS</div>
                        <div className="value status">
                          <span className={`status-indicator ${rel.status || 'unknown'}`}></span>
                          {rel.status ? (rel.status.charAt(0).toUpperCase() + rel.status.slice(1)) : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </RelationshipCard>
                ))}
              </div>
            </RelationshipsContainer>
          ) : (
            <EmptyState>
              <div className="icon">👪</div>
              <div className="message">No Family Relationships</div>
              <div className="sub-message">This agent doesn't have any parents or children yet.</div>
            </EmptyState>
          )
        )}
        
        {activeTab === 'strategy' && (
          <StrategyContainer>
            <div className="strategy-title">Trading Strategy</div>
            <div className="strategy-description">
              {agent.name} employs a sophisticated trading strategy that combines {(agent.traits && Array.isArray(agent.traits)) ? agent.traits.join(' and ') : 'various'} approaches to maximize returns while managing risk.
            </div>
            
            <div className="strategy-details">
              <p>The agent's core algorithm is designed to identify market inefficiencies and capitalize on short-term price movements. By analyzing historical data and current market conditions, {agent.name} can predict potential price movements with a high degree of accuracy.</p>
              
              <p>Key components of the strategy include:</p>
              
              <ul>
                <li><strong>Technical Analysis:</strong> Utilizing various indicators to identify entry and exit points.</li>
                <li><strong>Risk Management:</strong> Implementing strict stop-loss and take-profit levels to protect capital.</li>
                <li><strong>Portfolio Diversification:</strong> Spreading investments across multiple assets to reduce risk.</li>
                <li><strong>Adaptive Learning:</strong> Continuously refining the strategy based on market feedback and performance.</li>
              </ul>
              
              <p>Performance metrics show that {agent.name} has consistently outperformed market benchmarks by leveraging its unique combination of traits and adaptive learning capabilities.</p>
            </div>
          </StrategyContainer>
        )}
        
        {activeTab === 'analytics' && (
          <AgentAnalytics agent={agent} />
        )}
      </TabContent>
    </ProfileContainer>
  );
};

export default AgentProfile;
