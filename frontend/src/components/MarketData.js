import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaChartLine, FaFire, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Mock data
import { marketData, tradingActivities, agents } from '../utils/mockData';

const MarketDataContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: ${({ theme }) => theme.backgroundTertiary};
      color: ${({ theme }) => theme.primary};
    }
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: ${({ theme, active }) => active ? theme.primary : theme.backgroundTertiary};
  color: ${({ theme, active }) => active ? 'white' : theme.textSecondary};
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.backgroundSecondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

// Trading Activity Table
const TradesTable = styled.div`
  width: 100%;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.border};
    }
    
    th {
      font-weight: 600;
      color: ${({ theme }) => theme.textSecondary};
      background: ${({ theme }) => theme.backgroundTertiary};
      position: sticky;
      top: 0;
      z-index: 10;
      cursor: pointer;
      
      .sort-icon {
        margin-left: 0.5rem;
      }
    }
    
    tr:hover td {
      background: ${({ theme }) => theme.backgroundTertiary};
    }
    
    .trade-type {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.buy {
        background: rgba(16, 185, 129, 0.1);
        color: ${({ theme }) => theme.secondary};
      }
      
      &.sell {
        background: rgba(239, 68, 68, 0.1);
        color: ${({ theme }) => theme.danger};
      }
      
      &.swap {
        background: rgba(245, 158, 11, 0.1);
        color: ${({ theme }) => theme.accent};
      }
    }
    
    .change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      &.positive {
        color: ${({ theme }) => theme.secondary};
      }
      
      &.negative {
        color: ${({ theme }) => theme.danger};
      }
    }
    
    .agent-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .name {
        font-weight: 500;
      }
    }
  }
`;

// Market Sentiment
const SentimentSection = styled.div`
  margin-bottom: 2rem;
  
  .sentiment-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .sentiment-bars {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .sentiment-bar {
      .bar-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        
        .label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          
          &.bullish {
            color: ${({ theme }) => theme.secondary};
          }
          
          &.bearish {
            color: ${({ theme }) => theme.danger};
          }
        }
        
        .value {
          font-weight: 600;
        }
      }
      
      .bar {
        height: 0.75rem;
        background: ${({ theme }) => theme.backgroundTertiary};
        border-radius: 0.375rem;
        overflow: hidden;
        
        .progress {
          height: 100%;
          border-radius: 0.375rem;
          
          &.bullish {
            background: ${({ theme }) => theme.secondary};
          }
          
          &.bearish {
            background: ${({ theme }) => theme.danger};
          }
        }
      }
    }
  }
`;

// Trading Pairs
const TradingPairsTable = styled.div`
  width: 100%;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.border};
    }
    
    th {
      font-weight: 600;
      color: ${({ theme }) => theme.textSecondary};
      font-size: 0.875rem;
    }
    
    tr:hover td {
      background: ${({ theme }) => theme.backgroundTertiary};
    }
    
    .pair {
      font-weight: 500;
    }
    
    .price {
      font-family: monospace;
      font-weight: 600;
    }
    
    .volume {
      color: ${({ theme }) => theme.textSecondary};
    }
    
    .change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 500;
      
      &.positive {
        color: ${({ theme }) => theme.secondary};
      }
      
      &.negative {
        color: ${({ theme }) => theme.danger};
      }
    }
  }
`;

// Performance Cards
const PerformanceSection = styled.div`
  margin-bottom: 2rem;
  
  .section-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const PerformanceCard = styled.div`
  padding: 1rem;
  background: ${({ theme, type }) => 
    type === 'top' ? 'rgba(16, 185, 129, 0.1)' : 
    type === 'worst' ? 'rgba(239, 68, 68, 0.1)' : 
    theme.backgroundTertiary};
  border-radius: 0.5rem;
  border-left: 4px solid ${({ theme, type }) => 
    type === 'top' ? theme.secondary : 
    type === 'worst' ? theme.danger : 
    theme.border};
  
  .agent-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .name {
      font-weight: 600;
    }
  }
  
  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .label {
        font-size: 0.75rem;
        color: ${({ theme }) => theme.textSecondary};
      }
      
      .value {
        font-weight: 500;
        
        &.change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          
          &.positive {
            color: ${({ theme }) => theme.secondary};
          }
          
          &.negative {
            color: ${({ theme }) => theme.danger};
          }
        }
      }
    }
  }
`;

const MarketData = () => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [trades, setTrades] = useState([...tradingActivities]);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Sort trades when sort parameters change
  useEffect(() => {
    const sortedTrades = [...tradingActivities].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Special case for agent name
      if (sortField === 'agentName') {
        const agentA = agents.find(agent => agent.id === a.agentId);
        const agentB = agents.find(agent => agent.id === b.agentId);
        aValue = agentA ? agentA.name : '';
        bValue = agentB ? agentB.name : '';
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setTrades(sortedTrades);
  }, [sortField, sortDirection]);
  
  // Get agent name from ID
  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : `Agent #${agentId}`;
  };
  
  // Get agent avatar from ID
  const getAgentAvatar = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.avatar : `https://robohash.org/${agentId}?set=set3&size=200x200`;
  };
  
  // Render sort icon based on current sort state
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc' ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };
  
  return (
    <MarketDataContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="title">
            <div className="icon">
              <FaExchangeAlt />
            </div>
            Live Trading Activity
          </div>
          <div className="actions">
            <ActionButton>
              <FaChartLine />
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <TradesTable>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('type')}>
                    Type {renderSortIcon('type')}
                  </th>
                  <th onClick={() => handleSort('agentName')}>
                    Agent {renderSortIcon('agentName')}
                  </th>
                  <th onClick={() => handleSort('targetToken')}>
                    Token {renderSortIcon('targetToken')}
                  </th>
                  <th onClick={() => handleSort('tokenPrice')}>
                    Price {renderSortIcon('tokenPrice')}
                  </th>
                  <th onClick={() => handleSort('tokenAmount')}>
                    Amount {renderSortIcon('tokenAmount')}
                  </th>
                  <th onClick={() => handleSort('totalValue')}>
                    Value {renderSortIcon('totalValue')}
                  </th>
                  <th onClick={() => handleSort('priceChange')}>
                    Change {renderSortIcon('priceChange')}
                  </th>
                  <th onClick={() => handleSort('timestamp')}>
                    Time {renderSortIcon('timestamp')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 15).map(trade => (
                  <tr key={trade.id}>
                    <td>
                      <span className={`trade-type ${trade.type}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td>
                      <Link to={`/agent/${trade.agentId}`} className="agent-name">
                        <img 
                          src={getAgentAvatar(trade.agentId)} 
                          alt={getAgentName(trade.agentId)} 
                          className="avatar"
                        />
                        <span className="name">{getAgentName(trade.agentId)}</span>
                      </Link>
                    </td>
                    <td>{trade.targetToken}</td>
                    <td>${trade.tokenPrice.toFixed(4)}</td>
                    <td>{trade.tokenAmount.toLocaleString()}</td>
                    <td>${trade.totalValue.toLocaleString()}</td>
                    <td>
                      <span className={`change ${trade.priceChange > 0 ? 'positive' : 'negative'}`}>
                        {trade.priceChange > 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(trade.priceChange).toFixed(2)}%
                      </span>
                    </td>
                    <td>{trade.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TradesTable>
        </CardContent>
      </Card>
      
      <div>
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <div className="title">
              <div className="icon">
                <FaChartLine />
              </div>
              Market Sentiment
            </div>
          </CardHeader>
          <CardContent>
            <SentimentSection>
              <div className="sentiment-bars">
                <div className="sentiment-bar">
                  <div className="bar-label">
                    <div className="label bullish">
                      <FaArrowUp /> Bullish
                    </div>
                    <div className="value">{marketData.marketSentiment.bullish}%</div>
                  </div>
                  <div className="bar">
                    <div 
                      className="progress bullish" 
                      style={{ width: `${marketData.marketSentiment.bullish}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="sentiment-bar">
                  <div className="bar-label">
                    <div className="label bearish">
                      <FaArrowDown /> Bearish
                    </div>
                    <div className="value">{marketData.marketSentiment.bearish}%</div>
                  </div>
                  <div className="bar">
                    <div 
                      className="progress bearish" 
                      style={{ width: `${marketData.marketSentiment.bearish}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </SentimentSection>
            
            <TradingPairsTable>
              <table>
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Price</th>
                    <th>24h Volume</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.tradingPairs.map((pair, index) => (
                    <tr key={index}>
                      <td className="pair">{pair.pair}</td>
                      <td className="price">${pair.price.toFixed(4)}</td>
                      <td className="volume">${pair.volume.toLocaleString()}</td>
                      <td>
                        <span className={`change ${pair.change > 0 ? 'positive' : 'negative'}`}>
                          {pair.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                          {Math.abs(pair.change).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TradingPairsTable>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="title">
              <div className="icon">
                <FaFire />
              </div>
              Performance Leaders
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceSection>
              <div className="section-title">
                <FaArrowUp style={{ color: '#10B981' }} /> Top Performers
              </div>
              <PerformanceGrid>
                {marketData.topPerformers.map((agent, index) => (
                  <PerformanceCard key={index} type="top">
                    <Link to={`/agent/${agent.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="agent-info">
                        <img src={agent.avatar} alt={agent.name} className="avatar" />
                        <div className="name">{agent.name}</div>
                      </div>
                      <div className="stats">
                        <div className="stat">
                          <div className="label">TOKEN VALUE</div>
                          <div className="value">${agent.tokenValue.toLocaleString()}</div>
                        </div>
                        <div className="stat">
                          <div className="label">24H CHANGE</div>
                          <div className="value change positive">
                            <FaArrowUp />
                            {agent.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </Link>
                  </PerformanceCard>
                ))}
              </PerformanceGrid>
            </PerformanceSection>
            
            <PerformanceSection>
              <div className="section-title">
                <FaArrowDown style={{ color: '#EF4444' }} /> Worst Performers
              </div>
              <PerformanceGrid>
                {marketData.worstPerformers.map((agent, index) => (
                  <PerformanceCard key={index} type="worst">
                    <Link to={`/agent/${agent.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="agent-info">
                        <img src={agent.avatar} alt={agent.name} className="avatar" />
                        <div className="name">{agent.name}</div>
                      </div>
                      <div className="stats">
                        <div className="stat">
                          <div className="label">TOKEN VALUE</div>
                          <div className="value">${agent.tokenValue.toLocaleString()}</div>
                        </div>
                        <div className="stat">
                          <div className="label">24H CHANGE</div>
                          <div className="value change negative">
                            <FaArrowDown />
                            {Math.abs(agent.change).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </Link>
                  </PerformanceCard>
                ))}
              </PerformanceGrid>
            </PerformanceSection>
          </CardContent>
        </Card>
      </div>
    </MarketDataContainer>
  );
};

export default MarketData;
