import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTwitter, FaTelegram, FaDiscord, FaSort, FaFire, FaDna, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Mock data - would come from API in real implementation
import { agents } from '../utils/mockData';

const DashboardContainer = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: ${({ theme }) => theme.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme, active }) => active ? theme.backgroundTertiary : 'transparent'};
  color: ${({ theme, active }) => active ? theme.primary : theme.textSecondary};
  border: 1px solid ${({ theme, active }) => active ? theme.primary : 'transparent'};
  font-weight: ${({ active }) => active ? '600' : '400'};
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  
  &:hover {
    background: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.primary};
  }
`;

const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AgentCardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitionSpeed} ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadowMd};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  .agent-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme, status }) => theme[status] || theme.border};
    ${({ status, theme }) => status === 'breeding' && `
      animation: glow 2s infinite;
      box-shadow: 0 0 10px ${theme.breeding};
    `}
  }
  
  .agent-info {
    display: flex;
    flex-direction: column;
    
    .agent-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
    }
    
    .agent-id {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.textSecondary};
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .gen {
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: ${({ theme, gen }) => theme[`gen${gen}`] || theme.primary};
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
    
    .agent-traits {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      
      .trait {
        font-size: 0.75rem;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: ${({ theme }) => theme.backgroundTertiary};
        color: ${({ theme }) => theme.textSecondary};
      }
    }
  }
`;

const AgentStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  
  .stat {
    display: flex;
    flex-direction: column;
    
    .stat-label {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.textSecondary};
    }
    
    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: ${({ theme }) => theme.text};
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      &.token-address {
        font-size: 0.75rem;
        font-family: monospace;
        background: ${({ theme }) => theme.backgroundTertiary};
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.25rem;
  overflow: hidden;
  margin-top: 0.25rem;
  
  .progress {
    height: 100%;
    background: ${({ theme, status }) => 
      status === 'breeding' ? theme.breeding : 
      status === 'alive' ? theme.alive : 
      theme.primary};
    width: ${({ progress }) => `${progress}%`};
    transition: width 0.5s ease;
  }
`;

const AgentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  
  .social-links {
    display: flex;
    gap: 0.75rem;
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
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
  
  .view-profile {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.primary};
    color: white;
    font-weight: 600;
    transition: all ${({ theme }) => theme.transitionSpeed} ease;
    
    &:hover {
      background: ${({ theme }) => theme.primaryHover};
      transform: translateY(-3px);
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 1rem;
  margin: 2rem auto;
  max-width: 600px;
  
  h2 {
    color: ${({ theme }) => theme.danger};
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
`;

const AgentCard = ({ agent, setSelectedAgent }) => {
  return (
    <Link 
      to={`/agent/${agent.id}`} 
      style={{ textDecoration: 'none' }}
      onClick={() => setSelectedAgent(agent)}
    >
      <AgentCardContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AgentHeader status={agent.status} gen={agent.generation}>
          <img 
            src={agent.avatar || 'https://via.placeholder.com/80'} 
            alt={agent.name} 
            className="agent-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
          <div className="agent-info">
            <div className="agent-name">{agent.name}</div>
            <div className="agent-id">
              #{agent.id}
              <span className="gen">GEN_{agent.generation}</span>
            </div>
            <div className="agent-traits">
              {agent.traits && Array.isArray(agent.traits) && agent.traits.map((trait, i) => (
                <span key={i} className="trait">{trait}</span>
              ))}
            </div>
          </div>
        </AgentHeader>
        
        <AgentStats>
          <div className="stat">
            <div className="stat-label">TOKEN VALUE</div>
            <div className="stat-value">
              ${agent.tokenValue.toFixed(4)}
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
            <div className="stat-label">TOKEN CA</div>
            <div className="stat-value token-address">{agent.tokenAddress}</div>
          </div>
          <div className="stat">
            <div className="stat-label">HEALTH POINTS</div>
            <div className="stat-value">
              {agent.healthPoints > 0 ? agent.healthPoints : '💀'}
            </div>
          </div>
          <div className="stat" style={{ gridColumn: '1 / -1' }}>
            <div className="stat-label">
              {agent.status === 'breeding' ? 'BREED PROGRESS' : 'MARKET CAP'}
            </div>
            <div className="stat-value">
              {agent.marketCap >= 1000000 
                ? `$${(agent.marketCap / 1000000).toFixed(2)}M` 
                : agent.marketCap >= 1000 
                  ? `$${(agent.marketCap / 1000).toFixed(1)}K`
                  : `$${agent.marketCap.toFixed(2)}`
              }
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#64748b',
                marginLeft: '0.5rem'
              }}>
                ({agent.breedProgress}%)
                {agent.marketCapTrend && (
                  <span style={{ 
                    color: agent.marketCapTrend === 'up' ? '#10B981' : '#EF4444',
                    marginLeft: '0.5rem'
                  }}>
                    {agent.marketCapTrend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </span>
            </div>
            <ProgressBar 
              progress={agent.breedProgress} 
              status={agent.status}
            >
              <div className="progress"></div>
            </ProgressBar>
          </div>
        </AgentStats>
        
        <AgentFooter>
          <div className="social-links">
            <a href={agent.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href={agent.telegram} target="_blank" rel="noopener noreferrer">
              <FaTelegram />
            </a>
            <a href={agent.discord} target="_blank" rel="noopener noreferrer">
              <FaDiscord />
            </a>
          </div>
          
          <Link 
            to={`/agent/${agent.id}`} 
            className="view-profile"
            onClick={() => setSelectedAgent(agent)}
          >
            View Profile
          </Link>
        </AgentFooter>
      </AgentCardContainer>
    </Link>
  );
};

const Dashboard = ({ setSelectedAgent }) => {
  const [activeFilter, setActiveFilter] = useState('top');
  const [filteredAgents, setFilteredAgents] = useState([...(Array.isArray(agents) ? agents : [])]);
  const [liveAgents, setLiveAgents] = useState([...(Array.isArray(agents) ? agents : [])]);
  
  // Filter handlers
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (!Array.isArray(agents)) {
      console.error('Agents data is not an array');
      return;
    }
    
    if (filter === 'top') {
      setFilteredAgents([...liveAgents].sort((a, b) => b.tokenValue - a.tokenValue));
    } else if (filter === 'latest') {
      setFilteredAgents([...liveAgents].sort((a, b) => b.id - a.id));
    } else if (filter === 'breeding') {
      setFilteredAgents(liveAgents.filter(agent => agent.status === 'breeding'));
    }
  };
  
  // Simulate live data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLiveAgents(prevAgents => {
        return prevAgents.map(agent => {
          // Random fluctuation between -3% and +3%
          const tokenValueChange = agent.tokenValue * (Math.random() * 0.06 - 0.03);
          const walletBalanceChange = agent.walletBalance * (Math.random() * 0.04 - 0.02);
          const marketCapChange = agent.marketCap * (Math.random() * 0.05 - 0.025);
          
          // Update values
          const newTokenValue = Math.max(0.01, agent.tokenValue + tokenValueChange);
          const newWalletBalance = Math.max(100, agent.walletBalance + walletBalanceChange);
          const newMarketCap = Math.max(1000, agent.marketCap + marketCapChange);
          
          // Calculate new breed progress
          const breedThreshold = 5.0;
          const newBreedProgress = Math.min(100, Math.floor((newTokenValue / breedThreshold) * 100));
          
          // Add change indicators
          const tokenValueTrend = tokenValueChange > 0 ? 'up' : 'down';
          const walletBalanceTrend = walletBalanceChange > 0 ? 'up' : 'down';
          const marketCapTrend = marketCapChange > 0 ? 'up' : 'down';
          
          return {
            ...agent,
            tokenValue: newTokenValue,
            walletBalance: newWalletBalance,
            marketCap: newMarketCap,
            breedProgress: newBreedProgress,
            tokenValueTrend,
            walletBalanceTrend,
            marketCapTrend
          };
        });
      });
      
      // Update filtered agents based on current filter
      handleFilterChange(activeFilter);
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(updateInterval);
  }, [activeFilter]);
  
  try {
    return (
      <DashboardContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>AI Agent Trading Arena</h1>
        </Header>
        
        <FilterTabs>
          <FilterTab 
            active={activeFilter === 'top' ? 1 : 0}
            onClick={() => handleFilterChange('top')}
          >
            <FaSort /> Top Agents
          </FilterTab>
          <FilterTab 
            active={activeFilter === 'latest' ? 1 : 0}
            onClick={() => handleFilterChange('latest')}
          >
            <FaFire /> Latest Agents
          </FilterTab>
          <FilterTab 
            active={activeFilter === 'breeding' ? 1 : 0}
            onClick={() => handleFilterChange('breeding')}
          >
            <FaDna /> Breeding
          </FilterTab>
        </FilterTabs>
        
        <AgentsGrid>
          {filteredAgents.map((agent, index) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              setSelectedAgent={setSelectedAgent}
            />
          ))}
        </AgentsGrid>
      </DashboardContainer>
    );
  } catch (error) {
    console.error('Error in Dashboard component:', error);
    return (
      <ErrorMessage>
        <h2>Something went wrong</h2>
        <p>There was an error loading the dashboard. Please check the console for details.</p>
        <p>Error: {error.message}</p>
      </ErrorMessage>
    );
  }
};

export default Dashboard;
