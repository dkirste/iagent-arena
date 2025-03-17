import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaChartPie, FaChartBar, FaExchangeAlt, 
  FaCalendarAlt, FaCoins, FaRobot, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Styled Components
const AnalyticsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 0.5rem;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.25rem;
  }
  
  .change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    
    &.positive {
      color: ${({ theme }) => theme.success};
    }
    
    &.negative {
      color: ${({ theme }) => theme.error};
    }
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => active ? theme.backgroundTertiary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.primary : theme.textSecondary};
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.primary : 'transparent'};
  border-radius: 0.25rem 0.25rem 0 0;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.primary};
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
  
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
      background: ${({ theme }) => theme.backgroundTertiary};
    }
    
    tr:hover td {
      background: ${({ theme }) => theme.backgroundTertiary};
    }
    
    .positive {
      color: ${({ theme }) => theme.success};
    }
    
    .negative {
      color: ${({ theme }) => theme.error};
    }
  }
`;

// Helper function to generate random data
const generatePerformanceData = (days = 30) => {
  const data = [];
  let value = 10000;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    // Random daily change between -3% and +5%
    const change = value * (Math.random() * 0.08 - 0.03);
    value += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      profit: change > 0 ? Math.round(change * 100) / 100 : 0,
      loss: change < 0 ? Math.round(Math.abs(change) * 100) / 100 : 0,
    });
  }
  
  return data;
};

const generateTokenAllocation = (agentName) => {
  // Extract a token symbol from agent name (first 3-4 letters)
  const tokenSymbol = agentName.substring(0, Math.min(4, agentName.length)).toUpperCase();
  
  // Agent's own token gets the highest allocation (50-70%)
  const ownTokenAllocation = Math.floor(Math.random() * 20) + 50;
  
  // INJ gets second highest allocation (15-30%)
  const injAllocation = Math.floor(Math.random() * 15) + 15;
  
  // Remaining allocation goes to stablecoins (USDT, USDC)
  const remainingAllocation = 100 - (ownTokenAllocation + injAllocation);
  
  // Create the token allocation array - focusing only on agent token, INJ and stablecoins
  const tokens = [
    { name: tokenSymbol, value: ownTokenAllocation },
    { name: 'INJ', value: injAllocation },
    { name: 'USDT', value: Math.floor(remainingAllocation * 0.6) },
    { name: 'USDC', value: Math.floor(remainingAllocation * 0.4) }
  ];
  
  // Ensure total is exactly 100%
  const total = tokens.reduce((sum, token) => sum + token.value, 0);
  if (total !== 100) {
    // Adjust the first token to make total exactly 100
    tokens[0].value += (100 - total);
  }
  
  return tokens;
};

const generateStrategyPerformance = () => {
  const strategies = [
    'Market Making',
    'Arbitrage',
    'Trend Following',
    'Mean Reversion',
    'Breakout',
    'Momentum',
    'Scalping'
  ];
  
  return strategies.map(strategy => ({
    name: strategy,
    profit: Math.floor(Math.random() * 5000) + 1000,
    loss: Math.floor(Math.random() * 3000) + 500,
    trades: Math.floor(Math.random() * 100) + 20,
    winRate: Math.floor(Math.random() * 30) + 50, // 50-80%
  }));
};

const generateTradesByTimeData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return hours.map(hour => ({
    hour: `${hour}:00`,
    trades: Math.floor(Math.random() * 15) + 1,
    volume: Math.floor(Math.random() * 10000) + 1000,
  }));
};

const generateRiskMetrics = () => {
  return {
    sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2),
    sortino: (Math.random() * 2 + 0.5).toFixed(2),
    maxDrawdown: (Math.random() * 20 + 5).toFixed(2),
    volatility: (Math.random() * 15 + 5).toFixed(2),
    winRate: (Math.random() * 30 + 50).toFixed(2),
    profitFactor: (Math.random() * 2 + 1).toFixed(2),
    averageWin: (Math.random() * 500 + 100).toFixed(2),
    averageLoss: (Math.random() * 300 + 50).toFixed(2),
    expectancy: (Math.random() * 100 - 20).toFixed(2),
  };
};

// Token color mapping
const TOKEN_COLORS = {
  INJ: '#18c8ff',  // Injective blue
  USDT: '#26a17b', // Tether green
  USDC: '#2775ca', // USDC blue
};

// Cache for agent token colors to keep them consistent
const agentTokenColorCache = {};

// Helper function to generate a random color for tokens not in the mapping
const getTokenColor = (tokenName) => {
  if (TOKEN_COLORS[tokenName]) {
    return TOKEN_COLORS[tokenName];
  }
  
  // If we've already generated a color for this token, use it
  if (agentTokenColorCache[tokenName]) {
    return agentTokenColorCache[tokenName];
  }
  
  // Generate a vibrant color for agent's own token
  // Using hues that stand out (purples, pinks, oranges)
  let hue = Math.floor(Math.random() * 60) + 280; // 280-340 (purples, pinks)
  if (Math.random() > 0.5) {
    // Sometimes use orange/red hues
    hue = Math.floor(Math.random() * 60) + 10; // 10-70 (oranges, yellows)
  }
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 50;  // 50-70%
  
  // Store the color in the cache
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  agentTokenColorCache[tokenName] = color;
  
  return color;
};

// Main Component
const AgentAnalytics = ({ agent }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [tokenAllocation, setTokenAllocation] = useState([]);
  const [strategyPerformance, setStrategyPerformance] = useState([]);
  const [tradesByTime, setTradesByTime] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState({});
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [dataGenerated, setDataGenerated] = useState(false);
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
  
  // Generate data only once when component mounts or when timeframe changes
  useEffect(() => {
    // Only generate data if it hasn't been generated yet or if timeframe changes
    if (!dataGenerated || timeframe) {
      setIsLoading(true);
      
      setTimeout(() => {
        // Generate data based on timeframe
        let days;
        switch (timeframe) {
          case '7d': days = 7; break;
          case '30d': days = 30; break;
          case '90d': days = 90; break;
          case '1y': days = 365; break;
          default: days = 30;
        }
        
        setPerformanceData(generatePerformanceData(days));
        setTokenAllocation(generateTokenAllocation(agent.name));
        setStrategyPerformance(generateStrategyPerformance());
        setTradesByTime(generateTradesByTimeData());
        setRiskMetrics(generateRiskMetrics());
        setIsLoading(false);
        setDataGenerated(true);
      }, 1000);
    }
  }, [timeframe, agent?.id, dataGenerated]);
  
  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    if (!performanceData.length) return {};
    
    const startValue = performanceData[0].value;
    const endValue = performanceData[performanceData.length - 1].value;
    const totalReturn = ((endValue - startValue) / startValue) * 100;
    
    // Calculate daily returns
    const dailyReturns = [];
    for (let i = 1; i < performanceData.length; i++) {
      const prevValue = performanceData[i-1].value;
      const currentValue = performanceData[i].value;
      dailyReturns.push((currentValue - prevValue) / prevValue * 100);
    }
    
    // Calculate metrics
    const avgDailyReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
    const profitDays = dailyReturns.filter(r => r > 0).length;
    const lossDays = dailyReturns.filter(r => r < 0).length;
    
    return {
      totalReturn: totalReturn.toFixed(2),
      avgDailyReturn: avgDailyReturn.toFixed(2),
      profitDays,
      lossDays,
      winRate: ((profitDays / (profitDays + lossDays)) * 100).toFixed(2)
    };
  };
  
  const metrics = calculatePerformanceMetrics();
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: '#1e293b', 
          padding: '0.5rem', 
          border: '1px solid #334155',
          borderRadius: '0.25rem' 
        }}>
          <p style={{ margin: 0 }}>{`Date: ${label}`}</p>
          <p style={{ margin: 0, color: '#82ca9d' }}>{`Value: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <AnalyticsContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle><FaChartLine /> Loading Analytics...</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(0, 0, 0, 0.1)', 
            borderTopColor: '#3498db', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
        </div>
      </AnalyticsContainer>
    );
  }
  
  return (
    <AnalyticsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Performance Overview Section */}
      <div>
        <SectionTitle><FaChartLine /> Performance Overview</SectionTitle>
        
        <TabContainer>
          <Tab active={timeframe === '7d'} onClick={() => setTimeframe('7d')}>7 Days</Tab>
          <Tab active={timeframe === '30d'} onClick={() => setTimeframe('30d')}>30 Days</Tab>
          <Tab active={timeframe === '90d'} onClick={() => setTimeframe('90d')}>90 Days</Tab>
          <Tab active={timeframe === '1y'} onClick={() => setTimeframe('1y')}>1 Year</Tab>
        </TabContainer>
        
        <MetricsGrid>
          <MetricCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="title"><FaCoins /> Total Return</div>
            <div className="value">{metrics.totalReturn}%</div>
            <div className={`change ${parseFloat(metrics.totalReturn) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(metrics.totalReturn) >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(parseFloat(metrics.totalReturn))}% in {timeframe}
            </div>
          </MetricCard>
          
          <MetricCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="title"><FaChartLine /> Portfolio Value</div>
            <div className="value">{formatCurrency(performanceData[performanceData.length - 1]?.value || 0)}</div>
            <div className={`change ${parseFloat(metrics.totalReturn) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(metrics.totalReturn) >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {formatCurrency(Math.abs(performanceData[performanceData.length - 1]?.value - performanceData[0]?.value))}
            </div>
          </MetricCard>
          
          <MetricCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="title"><FaCalendarAlt /> Win Rate</div>
            <div className="value">{metrics.winRate}%</div>
            <div className="change positive">
              {metrics.profitDays} profit days vs {metrics.lossDays} loss days
            </div>
          </MetricCard>
          
          <MetricCard
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="title"><FaExchangeAlt /> Daily Return</div>
            <div className="value">{metrics.avgDailyReturn}%</div>
            <div className={`change ${parseFloat(metrics.avgDailyReturn) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(metrics.avgDailyReturn) >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              Average daily change
            </div>
          </MetricCard>
        </MetricsGrid>
        
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {/* Asset Allocation Section */}
      <div>
        <SectionTitle><FaChartPie /> Token Allocation</SectionTitle>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tokenAllocation.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getTokenColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    labelFormatter={(name) => `${name} Token`}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value, entry, index) => (
                      <span style={{ color: getTokenColor(value), fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Allocation</th>
                    <th>Value</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenAllocation.map((token, index) => (
                    <tr key={index}>
                      <td>{token.name}</td>
                      <td>{token.value}%</td>
                      <td>{formatCurrency((performanceData[performanceData.length - 1]?.value || 10000) * (token.value / 100))}</td>
                      <td className={Math.random() > 0.5 ? 'positive' : 'negative'}>
                        {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 10).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
          </div>
        </div>
      </div>
      
      {/* Strategy Performance Section */}
      <div>
        <SectionTitle><FaChartBar /> Strategy Performance</SectionTitle>
        
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={strategyPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" stackId="a" fill="#82ca9d" name="Profit" />
              <Bar dataKey="loss" stackId="a" fill="#ff8042" name="Loss" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Profit</th>
                <th>Loss</th>
                <th>Net P/L</th>
                <th>Trades</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {strategyPerformance.map((strategy, index) => (
                <tr key={index}>
                  <td>{strategy.name}</td>
                  <td className="positive">{formatCurrency(strategy.profit)}</td>
                  <td className="negative">{formatCurrency(strategy.loss)}</td>
                  <td className={strategy.profit > strategy.loss ? 'positive' : 'negative'}>
                    {formatCurrency(strategy.profit - strategy.loss)}
                  </td>
                  <td>{strategy.trades}</td>
                  <td>{strategy.winRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </div>
      
      {/* Trading Activity by Time */}
      <div>
        <SectionTitle><FaCalendarAlt /> Trading Activity by Time</SectionTitle>
        
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={tradesByTime}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="trades" stroke="#8884d8" activeDot={{ r: 8 }} name="Number of Trades" />
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#82ca9d" name="Volume (USD)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {/* Risk Metrics Section */}
      <div>
        <SectionTitle><FaRobot /> Risk & Performance Metrics</SectionTitle>
        
        <MetricsGrid>
          <MetricCard>
            <div className="title">Sharpe Ratio</div>
            <div className="value">{riskMetrics.sharpeRatio}</div>
            <div className="change">Risk-adjusted return</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Sortino Ratio</div>
            <div className="value">{riskMetrics.sortino}</div>
            <div className="change">Downside risk-adjusted return</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Max Drawdown</div>
            <div className="value">-{riskMetrics.maxDrawdown}%</div>
            <div className="change">Largest peak-to-trough decline</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Volatility</div>
            <div className="value">{riskMetrics.volatility}%</div>
            <div className="change">Standard deviation of returns</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Win Rate</div>
            <div className="value">{riskMetrics.winRate}%</div>
            <div className="change">Percentage of winning trades</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Profit Factor</div>
            <div className="value">{riskMetrics.profitFactor}</div>
            <div className="change">Gross profit / gross loss</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Average Win</div>
            <div className="value">{formatCurrency(riskMetrics.averageWin)}</div>
            <div className="change">Average profit per winning trade</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Average Loss</div>
            <div className="value">{formatCurrency(riskMetrics.averageLoss)}</div>
            <div className="change">Average loss per losing trade</div>
          </MetricCard>
          
          <MetricCard>
            <div className="title">Expectancy</div>
            <div className="value">{formatCurrency(riskMetrics.expectancy)}</div>
            <div className="change">Expected profit/loss per trade</div>
          </MetricCard>
        </MetricsGrid>
      </div>
    </AnalyticsContainer>
  );
};

export default AgentAnalytics;
