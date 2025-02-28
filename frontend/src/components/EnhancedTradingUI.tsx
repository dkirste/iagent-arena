import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Twitter, MessageCircle, ChevronDown, ChevronUp, 
  Globe, Award, TrendingUp, Clock, Users, BarChart2 } from 'lucide-react';

// Hierarchical token tree data structure
const mockTokens = {
  gen1: [
    {
      id: "token_gen1_001",
      name: "AlphaTrader",
      generation: "GEN_1",
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      value: 3275.42,
      balance: 12.5,
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      tradingStatus: "Active",
      tradingStyle: ["Momentum", "Market Neutral", "High Frequency"],
      profitability: 87,
      fundingProgress: 65,
      imageUrl: "/api/placeholder/100/100",
      trades: 432,
      winRate: 68.5,
      children: [
        {
          id: "token_gen2_001",
          name: "BetaHedge",
          generation: "GEN_2",
          contractAddress: "0x2345678901abcdef2345678901abcdef23456789",
          value: 875.31,
          balance: 5.2,
          walletAddress: "0xbcdef1234567890abcdef1234567890abcdef123",
          tradingStatus: "Active",
          tradingStyle: ["Mean Reversion", "Statistical Arbitrage"],
          profitability: 92,
          fundingProgress: 100,
          imageUrl: "/api/placeholder/100/100",
          isPrototype: false,
          trades: 187,
          winRate: 72.1,
          children: []
        },
        {
          id: "token_gen2_002",
          name: "DeltaScalp",
          generation: "GEN_2",
          contractAddress: "0x3456789012abcdef3456789012abcdef34567890",
          value: 943.87,
          balance: 7.8,
          walletAddress: "0xcdef1234567890abcdef1234567890abcdef1234",
          tradingStatus: "Active",
          tradingStyle: ["Scalping", "Breakout", "Technical"],
          profitability: 78,
          fundingProgress: 85,
          imageUrl: "/api/placeholder/100/100",
          isPrototype: false,
          trades: 563,
          winRate: 65.3,
          children: []
        }
      ]
    },
    {
      id: "token_gen1_002",
      name: "OmegaQuant",
      generation: "GEN_1",
      contractAddress: "0x7890123456abcdef7890123456abcdef78901234",
      value: 2985.67,
      balance: 10.8,
      walletAddress: "0xef1234567890abcdef1234567890abcdef123456",
      tradingStatus: "Active",
      tradingStyle: ["Quantitative", "Machine Learning", "Long-Short"],
      profitability: 81,
      fundingProgress: 90,
      imageUrl: "/api/placeholder/100/100",
      trades: 329,
      winRate: 64.2,
      children: []
    }
  ]
};

const EnhancedTradingUI = () => {
  const [tokens, setTokens] = useState(mockTokens);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [activeTab, setActiveTab] = useState("tree"); // "tree", "stats", "leaderboard"

  // Initialize expanded state for GEN_1 tokens
  useEffect(() => {
    const initialExpanded = {};
    tokens.gen1.forEach(token => {
      initialExpanded[token.id] = true;
    });
    setExpandedNodes(initialExpanded);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prevTokens => {
        const gen1Updated = prevTokens.gen1.map(token => ({
          ...token,
          value: +(token.value * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2),
          children: token.children.map(child => ({
            ...child,
            value: +(child.value * (1 + (Math.random() * 0.03 - 0.015))).toFixed(2)
          }))
        }));
        
        return {
          ...prevTokens,
          gen1: gen1Updated
        };
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } else {
        alert("Please install MetaMask or another compatible wallet!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Platform statistics calculation
  const getPlatformStats = () => {
    const allTokens = tokens.gen1.flatMap(token => [token, ...token.children]);
    const activeTokens = allTokens.filter(token => !token.isPrototype);
    
    const totalValue = activeTokens.reduce((sum, token) => sum + token.value, 0);
    const totalTrades = activeTokens.reduce((sum, token) => sum + token.trades, 0);
    const avgWinRate = activeTokens.reduce((sum, token) => sum + token.winRate, 0) / activeTokens.length;
    const totalAgents = activeTokens.length;
    
    return { totalValue, totalTrades, avgWinRate, totalAgents };
  };

  // Render token cards
  const renderTokenCard = (token, level = 0) => {
    const isExpanded = expandedNodes[token.id];
    const hasChildren = token.children && token.children.length > 0;
    
    const gradientBg = level === 0 
      ? 'bg-gradient-to-r from-blue-900 to-indigo-900'
      : 'bg-gradient-to-r from-purple-900 to-indigo-900';
    
    return (
      <div key={token.id} className="mb-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 rounded-xl ${darkMode ? gradientBg : 'bg-white'} shadow-lg border border-blue-500/30 ${level === 0 ? 'max-w-3xl mx-auto' : ''}`}
        >
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
              <img 
                src={token.imageUrl} 
                alt={token.name} 
                className="w-16 h-16 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    {token.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {token.generation}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                      {token.tradingStatus}
                    </span>
                  </div>
                </div>
                
                {hasChildren && (
                  <button 
                    onClick={() => toggleNodeExpansion(token.id)}
                    className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 border border-gray-700"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
              </div>
              
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Contract:</span>
                  <code className="text-xs px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700/50">
                    {formatAddress(token.contractAddress)}
                  </code>
                  <button onClick={() => copyToClipboard(token.contractAddress)} className="p-1 hover:bg-gray-800 rounded-full">
                    <Copy size={12} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Wallet:</span>
                  <code className="text-xs px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700/50">
                    {formatAddress(token.walletAddress)}
                  </code>
                  <button onClick={() => copyToClipboard(token.walletAddress)} className="p-1 hover:bg-gray-800 rounded-full">
                    <Copy size={12} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-400" />
                    <div className="text-xs text-gray-400">Token Value</div>
                  </div>
                  <div className="text-xl font-bold mt-1">
                    ${typeof token.value === 'number' ? token.value.toLocaleString() : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-green-400" />
                    <div className="text-xs text-gray-400">Balance</div>
                  </div>
                  <div className="text-xl font-bold mt-1">
                    {token.balance} INJ
                  </div>
                </div>
              </div>
              
              <div className="mb-4 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-xs text-gray-400">Profitability</span>
                  </div>
                  <span className="text-xs font-bold">{token.profitability}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700/50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${token.profitability}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${token.profitability > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : token.profitability > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                  />
                </div>
              </div>
              
              <div className="mb-4 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-400" />
                    <span className="text-xs text-gray-400">Funding Progress</span>
                  </div>
                  <span className="text-xs font-bold">{token.fundingProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700/50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${token.fundingProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={14} className="text-purple-400" />
                  <span className="text-xs text-gray-400">Trading Style</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {token.tradingStyle.map(style => (
                    <span key={style} className="text-xs px-2 py-1 rounded-full bg-gray-800/50 border border-gray-700/50">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-yellow-400" />
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {token.winRate}%
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-cyan-400" />
                    <div className="text-xs text-gray-400">Total Trades</div>
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {token.trades}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg"
                >
                  <ExternalLink size={14} />
                  Injective Explorer
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg"
                >
                  <MessageCircle size={14} />
                  Discord
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 shadow-lg"
                >
                  <Twitter size={14} />
                  Twitter
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Show children if expanded */}
        {isExpanded && hasChildren && (
          <div className="pl-8 ml-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-green-500/50 rounded-full"></div>
            {token.children.map(child => renderTokenCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render platform statistics
  const renderStatsSection = () => {
    const stats = getPlatformStats();
    
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
          Platform Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-4 shadow-lg border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">Total Value</h3>
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-4 shadow-lg border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">Total Trades</h3>
              <BarChart2 size={20} className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{stats.totalTrades.toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-4 shadow-lg border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">Avg. Win Rate</h3>
              <Award size={20} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold">{stats.avgWinRate.toFixed(1)}%</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-xl p-4 shadow-lg border border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 font-medium">Total Agents</h3>
              <Users size={20} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold">{stats.totalAgents}</p>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header/Navigation */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Injective Trading Arena
            </h1>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-sm"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              {!walletConnected ? (
                <button 
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-md shadow-lg"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">{formatAddress(walletAddress)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 mt-4">
            <button 
              onClick={() => setActiveTab("tree")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "tree" ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Agent Tree
            </button>
            <button 
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "stats" ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Statistics
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Filters */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 w-full sm:w-auto"
              />
              
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Trading</option>
                <option value="completed">Completed Funding</option>
              </select>
              
              <select 
                value={selectedGeneration}
                onChange={(e) => setSelectedGeneration(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700"
              >
                <option value="all">All Generations</option>
                <option value="GEN_1">Generation 1</option>
                <option value="GEN_2">Generation 2</option>
              </select>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-400">Last updated: </span>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Active Section Content */}
        {activeTab === "tree" && (
          <div>
            {/* Agent Tree */}
            {tokens.gen1.map(token => renderTokenCard(token))}
          </div>
        )}
        
        {activeTab === "stats" && renderStatsSection()}
      </main>
    </div>
  );
};

export default EnhancedTradingUI;