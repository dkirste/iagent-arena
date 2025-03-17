import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Import mock data
import { globalStats, agents } from '../utils/mockData';

const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme, color }) => color ? theme[color] : theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .change {
    font-size: 0.875rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: ${({ theme, change }) => 
      change > 0 ? theme.secondary : 
      change < 0 ? theme.danger : 
      theme.textSecondary};
  }
`;

const GlobalStats = () => {
  try {
    // Format numbers for display
    const formatCurrency = (value) => {
      if (!value && value !== 0) return '$0';
      
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      } else if (value >= 1) {
        return `$${value.toFixed(2)}`;
      } else {
        // For values less than $1, show more decimal places
        return `$${value.toFixed(4)}`;
      }
    };
    
    // Format token values (for smaller amounts)
    const formatTokenValue = (value) => {
      if (!value && value !== 0) return '$0';
      
      // For token values, always show 4 decimal places
      return `$${value.toFixed(4)}`;
    };
    
    // Safely get data with fallbacks
    const safeAgents = Array.isArray(agents) ? agents : [];
    const safeGlobalStats = globalStats || { 
      tradingVolume: 0, 
      aliveAgents: 0, 
      totalAgents: 0 
    };
    
    // Calculate highest token value
    const highestTokenValue = safeAgents.length > 0 
      ? Math.max(...safeAgents.map(agent => agent.tokenValue || 0))
      : 0;
    
    // Calculate highest market cap
    const highestMarketCap = safeAgents.length > 0
      ? Math.max(...safeAgents.map(agent => agent.marketCap || 0))
      : 0;
    
    // Calculate total market cap
    const totalMarketCap = safeAgents.reduce((sum, agent) => sum + (agent.marketCap || 0), 0);
    
    // Calculate breeding agents
    const breedingAgents = safeAgents.filter(agent => agent.status === 'breeding').length;
    
    // Prepare stats with real data
    const stats = [
      { 
        label: 'TOTAL TRADING VOLUME', 
        value: formatCurrency(safeGlobalStats.tradingVolume), 
        change: 12.5,
        color: 'primary',
        showPercentage: true
      },
      { 
        label: 'ACTIVE AGENTS', 
        value: safeGlobalStats.aliveAgents?.toString() || '0', 
        change: 1,
        color: 'alive',
        showPercentage: false
      },
      { 
        label: 'TOTAL AGENTS', 
        value: safeGlobalStats.totalAgents?.toString() || '0', 
        change: 0,
        color: null,
        showPercentage: true
      },
      { 
        label: 'HIGHEST AGENT TOKEN INCREASE', 
        value: formatTokenValue(highestTokenValue), 
        change: 8.3,
        color: 'secondary',
        showPercentage: true
      },
      { 
        label: 'HIGHEST AGENT MCAP', 
        value: formatCurrency(highestMarketCap), 
        change: 5.2,
        color: 'primary',
        showPercentage: true
      },
      { 
        label: 'TOTAL AGENT MCAP', 
        value: formatCurrency(totalMarketCap), 
        change: 3.7,
        color: 'secondary',
        showPercentage: true
      },
      { 
        label: 'BREEDING AGENTS', 
        value: breedingAgents.toString(), 
        change: null,
        color: 'breeding',
        showPercentage: true
      },
    ];
    
    return (
      <StatsContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue color={stat.color} change={stat.change}>
              {stat.value}
              {stat.change !== null && (
                <span className="change">
                  {stat.change > 0 ? <FaArrowUp /> : stat.change < 0 ? <FaArrowDown /> : null}
                  {Math.abs(stat.change)}{stat.showPercentage ? '%' : ''}
                </span>
              )}
            </StatValue>
          </StatCard>
        ))}
      </StatsContainer>
    );
  } catch (error) {
    console.error('Error in GlobalStats component:', error);
    return (
      <div style={{ 
        padding: '1rem', 
        textAlign: 'center', 
        color: 'white',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b'
      }}>
        <p>Stats loading...</p>
      </div>
    );
  }
};

export default GlobalStats;
