import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaArrowUp, FaArrowDown, FaFilter } from 'react-icons/fa';

// Mock data
import { agents, tradingActivities } from '../utils/mockData';

const TradingArenaContainer = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: ${({ theme }) => theme.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  select {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
    
    &:focus {
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;

const ArenaLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  height: calc(100vh - 300px);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const LiveTradesSection = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .count {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const TradesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TradeItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.5rem;
  border-left: 4px solid ${({ theme, type }) => 
    type === 'buy' ? theme.secondary : 
    type === 'sell' ? theme.danger : 
    theme.accent};
  
  .agent-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .trade-details {
    flex: 1;
    
    .trade-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      
      .agent-name {
        font-weight: 600;
      }
      
      .trade-time {
        font-size: 0.75rem;
        color: ${({ theme }) => theme.textSecondary};
      }
    }
    
    .trade-action {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      
      .action-type {
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        background: ${({ theme, type }) => 
          type === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 
          type === 'sell' ? 'rgba(239, 68, 68, 0.1)' : 
          'rgba(245, 158, 11, 0.1)'};
        color: ${({ theme, type }) => 
          type === 'buy' ? theme.secondary : 
          type === 'sell' ? theme.danger : 
          theme.accent};
        font-weight: 600;
        text-transform: uppercase;
      }
    }
    
    .trade-tokens {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.textSecondary};
      margin-top: 0.5rem;
    }
  }
  
  .trade-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    .value {
      font-weight: 600;
      color: ${({ theme, type }) => 
        type === 'buy' ? theme.secondary : 
        type === 'sell' ? theme.danger : 
        theme.accent};
    }
    
    .change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: ${({ theme, change }) => 
        change > 0 ? theme.secondary : 
        change < 0 ? theme.danger : 
        theme.textSecondary};
    }
  }
`;

const VisualizationSection = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const VisualizationContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  background: ${({ theme }) => theme.gradientBackground};
`;

const TokensContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TokenNode = styled(motion.div)`
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  background: ${({ theme, status }) => 
    status === 'alive' ? theme.alive : 
    status === 'breeding' ? theme.breeding : 
    status === 'dead' ? 'rgba(239, 68, 68, 0.5)' : 
    theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 15px ${({ theme, status }) => 
    status === 'alive' ? 'rgba(16, 185, 129, 0.5)' : 
    status === 'breeding' ? 'rgba(245, 158, 11, 0.5)' : 
    status === 'dead' ? 'rgba(239, 68, 68, 0.3)' : 
    'rgba(124, 58, 237, 0.5)'};
  
  img {
    width: 70%;
    height: 70%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const TokenLabel = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.backgroundTertiary};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  pointer-events: none;
`;

const TradeConnection = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
`;

const TradingArena = () => {
  const [filter, setFilter] = useState('all');
  const [filteredTrades, setFilteredTrades] = useState([...tradingActivities]);
  const [tokenPositions, setTokenPositions] = useState([]);
  const [activeConnections, setActiveConnections] = useState([]);
  
  // Filter trades based on selected filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTrades([...tradingActivities]);
    } else if (filter === 'buys') {
      setFilteredTrades(tradingActivities.filter(trade => trade.type === 'buy'));
    } else if (filter === 'sells') {
      setFilteredTrades(tradingActivities.filter(trade => trade.type === 'sell'));
    } else if (filter === 'swaps') {
      setFilteredTrades(tradingActivities.filter(trade => trade.type === 'swap'));
    }
  }, [filter]);
  
  // Generate random positions for tokens
  useEffect(() => {
    const positions = agents.map(agent => {
      // Calculate size based on token value (min 40, max 120)
      const size = Math.max(40, Math.min(120, Math.sqrt(agent.tokenValue / 10000) * 3));
      
      // Generate random position within container
      const x = Math.random() * (100 - size / 3) + size / 6;
      const y = Math.random() * (100 - size / 3) + size / 6;
      
      return {
        id: agent.id,
        name: agent.name,
        avatar: agent.avatar,
        status: agent.status,
        tokenValue: agent.tokenValue,
        size,
        x: `${x}%`,
        y: `${y}%`,
      };
    });
    
    setTokenPositions(positions);
    
    // Simulate random trades for visualization
    const interval = setInterval(() => {
      if (agents.length < 2) return;
      
      // Randomly select two different agents
      const sourceIndex = Math.floor(Math.random() * agents.length);
      let targetIndex;
      do {
        targetIndex = Math.floor(Math.random() * agents.length);
      } while (targetIndex === sourceIndex);
      
      const source = agents[sourceIndex];
      const target = agents[targetIndex];
      
      // Create a new connection
      const newConnection = {
        id: Date.now(),
        source: source.id,
        target: target.id,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
      };
      
      setActiveConnections(prev => [...prev, newConnection]);
      
      // Remove connection after animation
      setTimeout(() => {
        setActiveConnections(prev => prev.filter(conn => conn.id !== newConnection.id));
      }, 2000);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TradingArenaContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Trading Arena</h1>
        
        <FilterControls>
          <div className="filter-label">
            <FaFilter /> Filter:
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Trades</option>
            <option value="buys">Buys Only</option>
            <option value="sells">Sells Only</option>
            <option value="swaps">Swaps Only</option>
          </select>
        </FilterControls>
      </Header>
      
      <ArenaLayout>
        <LiveTradesSection>
          <SectionHeader>
            <div className="title">
              <FaExchangeAlt /> Live Trades
            </div>
            <div className="count">{filteredTrades.length}</div>
          </SectionHeader>
          
          <TradesList>
            {filteredTrades.map((trade, index) => {
              const agent = agents.find(a => a.id === trade.agentId);
              if (!agent) return null;
              
              return (
                <TradeItem
                  key={trade.id}
                  type={trade.type}
                  change={trade.priceChange}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <img 
                    src={agent.avatar} 
                    alt={agent.name} 
                    className="agent-avatar"
                  />
                  
                  <div className="trade-details">
                    <div className="trade-header">
                      <div className="agent-name">{agent.name}</div>
                      <div className="trade-time">{trade.time}</div>
                    </div>
                    
                    <div className="trade-action">
                      <div className="action-type">{trade.type}</div>
                      {trade.targetToken}
                    </div>
                    
                    <div className="trade-tokens">
                      {trade.tokenAmount.toLocaleString()} tokens at ${trade.tokenPrice.toFixed(4)}
                    </div>
                  </div>
                  
                  <div className="trade-value">
                    <div className="value">${trade.totalValue.toLocaleString()}</div>
                    <div className="change">
                      {trade.priceChange > 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {Math.abs(trade.priceChange).toFixed(2)}%
                    </div>
                  </div>
                </TradeItem>
              );
            })}
          </TradesList>
        </LiveTradesSection>
        
        <VisualizationSection>
          <SectionHeader>
            <div className="title">
              Token Ecosystem
            </div>
          </SectionHeader>
          
          <VisualizationContent>
            <TokensContainer>
              {/* Render trade connections */}
              <TradeConnection>
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  {activeConnections.map(conn => {
                    const source = tokenPositions.find(t => t.id === conn.source);
                    const target = tokenPositions.find(t => t.id === conn.target);
                    
                    if (!source || !target) return null;
                    
                    // Extract numeric values from percentage strings
                    const sourceX = parseFloat(source.x) / 100;
                    const sourceY = parseFloat(source.y) / 100;
                    const targetX = parseFloat(target.x) / 100;
                    const targetY = parseFloat(target.y) / 100;
                    
                    return (
                      <motion.path
                        key={conn.id}
                        d={`M ${sourceX * 100}% ${sourceY * 100}% C ${(sourceX + targetX) * 50}% ${sourceY * 100}%, ${(sourceX + targetX) * 50}% ${targetY * 100}%, ${targetX * 100}% ${targetY * 100}%`}
                        stroke={conn.type === 'buy' ? '#10B981' : '#EF4444'}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                      />
                    );
                  })}
                </svg>
              </TradeConnection>
              
              {/* Render token nodes */}
              {tokenPositions.map(token => (
                <TokenNode
                  key={token.id}
                  style={{ left: token.x, top: token.y }}
                  size={token.size}
                  status={token.status}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: token.id * 0.1
                  }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                >
                  <img src={token.avatar} alt={token.name} />
                  <TokenLabel>
                    {token.name} - ${token.tokenValue.toLocaleString()}
                  </TokenLabel>
                </TokenNode>
              ))}
            </TokensContainer>
          </VisualizationContent>
        </VisualizationSection>
      </ArenaLayout>
    </TradingArenaContainer>
  );
};

export default TradingArena;
