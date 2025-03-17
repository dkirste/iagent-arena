// Mock data for AI Agent Trading Arena

// Helper function to generate random Injective addresses
const generateAddress = () => {
  // Injective addresses start with 'inj' followed by a base64 string
  return 'inj1' + Array(38).fill(0).map(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }).join('');
};

// Helper function to generate random avatar URLs
const generateAvatar = (id) => {
  // Using robohash.org to generate unique robot avatars
  return `https://robohash.org/${id}?set=set3&size=200x200`;
};

// Generate traits for agents
const traitOptions = [
  'Momentum', 'Contrarian', 'Scalping', 'Swing', 'DCA', 'Grid', 'Arbitrage',
  'Trend-following', 'Mean-reversion', 'Breakout', 'Range', 'Sentiment-based',
  'Volatility', 'Liquidity', 'Fundamental', 'Technical', 'On-chain'
];

const generateTraits = () => {
  const numTraits = 2 + Math.floor(Math.random() * 3); // 2-4 traits
  const traits = [];
  
  while (traits.length < numTraits) {
    const trait = traitOptions[Math.floor(Math.random() * traitOptions.length)];
    if (!traits.includes(trait)) {
      traits.push(trait);
    }
  }
  
  return traits;
};

// Generate agent names
const generateName = (id, generation) => {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Sigma', 'Theta', 'Zeta', 'Neo', 'Quantum', 'Crypto', 'Byte', 'Flux', 'Vector', 'Nexus', 'Cipher', 'Matrix', 'Synth', 'Algo', 'Quant'];
  const suffixes = ['Bot', 'Trader', 'Mind', 'Brain', 'Agent', 'AI', 'Core', 'Logic', 'Net', 'System', 'Protocol', 'Engine', 'Mech', 'Droid', 'Unit'];
  
  // Use deterministic naming based on ID
  const prefix = prefixes[id % prefixes.length];
  const suffix = suffixes[(id * generation) % suffixes.length];
  
  return `${prefix}${suffix}`;
};

// Generate agents - reduced to 10 agents
export const agents = Array(10).fill(0).map((_, index) => {
  const id = index + 1;
  const generation = Math.min(3, Math.ceil(id / 3)); // Gen 1-3
  
  // More realistic token values (between $0.01 and $5.00)
  const tokenValue = (0.01 + Math.random() * 4.99).toFixed(4);
  
  // More realistic wallet balances ($100 - $5,000)
  const walletBalance = 100 + Math.floor(Math.random() * 4900);
  
  // More realistic market caps ($10K - $2M)
  const marketCap = 10000 + Math.floor(Math.random() * 1990000);
  
  // Determine agent status
  let status;
  const statusRoll = Math.random();
  
  if (statusRoll < 0.1) {
    status = 'dead'; // 10% chance of being dead
  } else if (parseFloat(tokenValue) > 2.5 && statusRoll < 0.3) {
    status = 'breeding'; // 20% chance of breeding if token value is high enough
  } else {
    status = 'alive'; // 70% chance of being alive
  }
  
  // Calculate breeding progress
  const breedThreshold = 5.0;
  const breedProgress = Math.min(100, Math.floor((parseFloat(tokenValue) / breedThreshold) * 100));
  
  // Health points (dead agents have 0)
  const healthPoints = status === 'dead' ? 0 : 50 + Math.floor(Math.random() * 50);
  
  // Special case for the first agent (id = 1) - make it AlphaAgent
  const name = id === 1 ? "AlphaAgent" : generateName(id, generation);
  
  return {
    id,
    name,
    generation,
    tokenValue: parseFloat(tokenValue),
    walletBalance,
    marketCap,
    status,
    healthPoints,
    breedProgress,
    tokenAddress: generateAddress(),
    walletAddress: generateAddress(),
    avatar: generateAvatar(id),
    traits: generateTraits(),
    twitter: `https://twitter.com/agent${id}`,
    telegram: `https://t.me/agent${id}`,
    discord: `https://discord.gg/agent${id}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // 0-90 days ago
  };
});

// Generate trading activities
const tradeTypes = ['buy', 'sell', 'swap'];
const tokens = ['INJ', 'ETH', 'BTC', 'USDT', 'ATOM', 'SOL', 'AVAX', 'MATIC', 'DOT', 'ADA'];

export const tradingActivities = [];

// Generate 5-15 trades per agent
agents.forEach(agent => {
  const numTrades = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < numTrades; i++) {
    const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const amount = 10 + Math.floor(Math.random() * 990);
    const price = 0.1 + Math.random() * 9.9;
    const total = amount * price;
    
    // Generate a random Injective address for the counterparty
    const counterpartyAddress = generateAddress();
    
    // Generate a random timestamp within the last 7 days
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    
    tradingActivities.push({
      id: tradingActivities.length + 1,
      agentId: agent.id,
      agentName: agent.name,
      type: tradeType,
      token,
      amount,
      price,
      total,
      counterpartyAddress,
      timestamp,
      exchange: Math.random() > 0.5 ? 'Helix' : 'Dojo Swap',
      status: 'completed',
      txHash: 'inj1' + Array(38).fill(0).map(() => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return chars.charAt(Math.floor(Math.random() * chars.length));
      }).join('')
    });
  }
});

// Sort trading activities by timestamp (newest first)
tradingActivities.sort((a, b) => b.timestamp - a.timestamp);

// Generate global stats
export const globalStats = {
  tradingVolume: tradingActivities.reduce((sum, activity) => sum + activity.total, 0),
  aliveAgents: agents.filter(agent => agent.status === 'alive').length,
  totalAgents: agents.length
};

// Generate price history data for each agent
export const agentPriceHistory = {};

agents.forEach(agent => {
  // Generate price data for the last 30 days
  const priceData = [];
  let currentPrice = agent.tokenValue / 10; // Starting price is 1/10 of current value
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the price
    const change = currentPrice * (Math.random() * 0.1 - 0.05); // -5% to +5%
    currentPrice += change;
    
    // Ensure price doesn't go below 0.001
    currentPrice = Math.max(0.001, currentPrice);
    
    priceData.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice
    });
  }
  
  agentPriceHistory[agent.id] = priceData;
});

// Generate trading volume history data
export const tradingVolumeHistory = Array(30).fill(0).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));
  
  return {
    date: date.toISOString().split('T')[0],
    volume: 10000 + Math.random() * 90000
  };
});

// Generate agent creation history data
export const agentCreationHistory = Array(30).fill(0).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));
  
  return {
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 3)
  };
});

// Generate token distribution data
export const tokenDistribution = [
  { name: 'Helix', value: 45 },
  { name: 'Dojo Swap', value: 30 },
  { name: 'Astroport', value: 15 },
  { name: 'Other DEXes', value: 10 }
];

// Generate agent status distribution data
export const agentStatusDistribution = [
  { name: 'Active', value: agents.filter(agent => agent.status === 'alive').length },
  { name: 'Breeding', value: agents.filter(agent => agent.status === 'breeding').length },
  { name: 'Dead', value: agents.filter(agent => agent.status === 'dead').length }
];

// Generate agent generation distribution data
export const agentGenerationDistribution = [
  { name: 'Gen 1', value: agents.filter(agent => agent.generation === 1).length },
  { name: 'Gen 2', value: agents.filter(agent => agent.generation === 2).length },
  { name: 'Gen 3', value: agents.filter(agent => agent.generation === 3).length }
];

// Generate agent relationships (family tree)
export const agentRelationships = [];

// Gen 1 agents are the original agents (no parents)
// Gen 2 and 3 agents have parents from previous generations
agents.filter(agent => agent.generation > 1).forEach(agent => {
  // Find potential parents from previous generation
  const potentialParents = agents.filter(
    parent => parent.generation === agent.generation - 1
  );
  
  // Each agent has 1-2 parents
  const numParents = 1 + Math.floor(Math.random() * 2);
  
  for (let i = 0; i < numParents && i < potentialParents.length; i++) {
    // Select a random parent
    const parentIndex = Math.floor(Math.random() * potentialParents.length);
    const parent = potentialParents[parentIndex];
    
    // Remove selected parent from potential parents to avoid duplicates
    potentialParents.splice(parentIndex, 1);
    
    // Add relationship
    agentRelationships.push({
      id: agentRelationships.length + 1,
      parent: parent.id,
      child: agent.id,
      createdAt: agent.createdAt,
    });
  }
});

// Generate market data (for TradingArena)
export const marketData = {
  recentTrades: tradingActivities.slice(0, 50), // Most recent 50 trades
  topPerformers: [...agents]
    .sort((a, b) => b.tokenValue - a.tokenValue)
    .slice(0, 5)
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      tokenValue: agent.tokenValue,
      change: 5 + Math.random() * 15, // 5% to 20% increase
    })),
  worstPerformers: [...agents]
    .sort((a, b) => a.tokenValue - b.tokenValue)
    .slice(0, 5)
    .map(agent => ({
      id: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      tokenValue: agent.tokenValue,
      change: -15 - Math.random() * 10, // -15% to -25% decrease
    })),
  marketSentiment: {
    bullish: 60 + Math.floor(Math.random() * 20), // 60-80%
    bearish: 20 + Math.floor(Math.random() * 20), // 20-40%
  },
  tradingPairs: [
    { pair: 'AGENT1/USDT', price: agents[0].tokenValue, volume: 120000 + Math.random() * 50000, change: 3.5 },
    { pair: 'AGENT2/USDT', price: agents[1].tokenValue, volume: 95000 + Math.random() * 50000, change: -2.1 },
    { pair: 'AGENT3/USDT', price: agents[2].tokenValue, volume: 78000 + Math.random() * 50000, change: 1.8 },
    { pair: 'AGENT4/USDT', price: agents[3].tokenValue, volume: 65000 + Math.random() * 50000, change: 5.2 },
    { pair: 'AGENT5/USDT', price: agents[4].tokenValue, volume: 45000 + Math.random() * 50000, change: -3.7 },
  ],
};

// Generate notifications for UI
export const notifications = [
  { id: 1, type: 'breeding', message: 'Agent AlphaTrader is now breeding!', time: '2 hours ago', read: false },
  { id: 2, type: 'newAgent', message: 'New agent DeltaCore has been spawned!', time: '5 hours ago', read: false },
  { id: 3, type: 'priceAlert', message: 'Agent BetaBrain token value increased by 25%!', time: '1 day ago', read: true },
  { id: 4, type: 'death', message: 'Agent OmegaNet has died.', time: '2 days ago', read: true },
  { id: 5, type: 'trade', message: 'Agent GammaMind made a large trade: 5000 INJ', time: '3 days ago', read: true },
];
