import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Twitter, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
          tradingStyle: ["Mean Reversion", "Statistical Arbitrage", "Volatility"],
          profitability: 92,
          fundingProgress: 100,
          imageUrl: "/api/placeholder/100/100",
          isPrototype: false,
          trades: 187,
          winRate: 72.1,
          children: [
            {
              id: "token_gen3_001",
              name: "GammaArb",
              generation: "GEN_3",
              contractAddress: "0x5678901234abcdef5678901234abcdef56789012",
              value: 342.18,
              balance: 2.3,
              walletAddress: "0xdef1234567890abcdef1234567890abcdef12345",
              tradingStatus: "Active",
              tradingStyle: ["Statistical Arbitrage", "Cross-Exchange", "Low Latency"],
              profitability: 94,
              fundingProgress: 75,
              imageUrl: "/api/placeholder/100/100",
              isPrototype: false,
              trades: 134,
              winRate: 76.3,
              children: []
            },
            {
              id: "token_gen3_002",
              name: "ProtoGamma-01",
              generation: "GEN_3",
              contractAddress: "0x6789012345abcdef6789012345abcdef67890123",
              imageUrl: "/api/placeholder/100/100",
              isPrototype: true,
              tradingStyle: ["Pending Algorithm Deployment"],
              children: []
            }
          ]
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
        },
        {
          id: "token_gen2_003",
          name: "ProtoAgent-01",
          generation: "GEN_2",
          contractAddress: "0x4567890123abcdef4567890123abcdef45678901",
          imageUrl: "/api/placeholder/100/100",
          isPrototype: true,
          tradingStyle: ["Pending Algorithm Deployment"],
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
      children: [
        {
          id: "token_gen2_004",
          name: "ThetaML",
          generation: "GEN_2",
          contractAddress: "0x8901234567abcdef8901234567abcdef89012345",
          value: 1105.42,
          balance: 6.4,
          walletAddress: "0xf1234567890abcdef1234567890abcdef1234567",
          tradingStatus: "Active",
          tradingStyle: ["Deep Learning", "Reinforcement Learning", "NLP Trading"],
          profitability: 89,
          fundingProgress: 95,
          imageUrl: "/api/placeholder/100/100",
          isPrototype: false,
          trades: 278,
          winRate: 69.8,
          children: [
            {
              id: "token_gen3_003",
              name: "EpsilonPredictor",
              generation: "GEN_3",
              contractAddress: "0x9012345678abcdef9012345678abcdef90123456",
              value: 485.29,
              balance: 3.1,
              walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
              tradingStatus: "Active",
              tradingStyle: ["Predictive Analytics", "Time Series Forecasting"],
              profitability: 86,
              fundingProgress: 70,
              imageUrl: "/api/placeholder/100/100",
              isPrototype: false,
              trades: 167,
              winRate: 72.5,
              children: []
            }
          ]
        },
        {
          id: "token_gen2_005",
          name: "SigmaFlow",
          generation: "GEN_2",
          contractAddress: "0xa0123456789abcdefa0123456789abcdefa01234",
          value: 927.31,
          balance: 5.9,
          walletAddress: "0x234567890abcdef1234567890abcdef123456789",
          tradingStatus: "Active",
          tradingStyle: ["Flow Trading", "Order Book Analysis", "Liquidity Provision"],
          profitability: 76,
          fundingProgress: 80,
          imageUrl: "/api/placeholder/100/100",
          isPrototype: false,
          trades: 412,
          winRate: 61.7,
          children: []
        }
      ]
    }
  ]
};

const TokenTreeVisualization = () => {
  const [tokens, setTokens] = useState(mockTokens);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedGeneration, setSelectedGeneration] = useState("all");

  // Simulate real-time updates using recursion to handle the nested structure
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prevTokens => {
        // Helper function to update token values recursively
        const updateTokenValues = (token) => {
          if (token.isPrototype) return token;
          
          const updatedToken = {
            ...token,
            value: token.value ? +(token.value * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2) : 0
          };
          
          if (token.children && token.children.length > 0) {
            updatedToken.children = token.children.map(child => updateTokenValues(child));
          }
          
          return updatedToken;
        };
        
        // Update all tokens in the tree
        return {
          ...prevTokens,
          gen1: prevTokens.gen1.map(token => updateTokenValues(token))
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
    if (window.ethereum) {
      try {
        // Using the ethereum object directly without external libraries
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another compatible wallet!");
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render a token card with its children
  const renderTokenCard = (token, level = 0) => {
    const isExpanded = expandedNodes[token.id];
    const hasChildren = token.children && token.children.length > 0;
    
    const cardClasses = `p-${level === 0 ? '6' : '4'} rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow ${token.isPrototype ? 'opacity-70' : ''} ${level === 0 ? 'max-w-3xl mx-auto' : ''}`;
    const imgSize = level === 0 ? 'w-16 h-16' : 'w-12 h-12';
    
    return (
      <div key={token.id} className="mb-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cardClasses}
        >
          <div className="flex items-start gap-3">
            <img 
              src={token.imageUrl} 
              alt={token.name} 
              className={`${imgSize} rounded-full object-cover ${token.isPrototype ? 'grayscale' : ''}`}
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className={level === 0 ? 'text-xl font-bold' : 'text-lg font-bold'}>{token.name}</h2>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${level === 0 ? 'bg-blue-600' : level === 1 ? 'bg-purple-600' : 'bg-green-600'} text-white`}>
                    {token.generation}
                  </span>
                </div>
                
                {hasChildren && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex gap-2"
                  >
                    <button 
                      onClick={() => toggleNodeExpansion(token.id)}
                      className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </motion.div>
                )}
              </div>
              
              {!token.isPrototype ? (
                <>
                  <div className="mb-3 flex flex-wrap gap-y-2">
                    <div className="w-full sm:w-1/2 flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Contract:</span>
                      <code className="text-xs">{formatAddress(token.contractAddress)}</code>
                      <button onClick={() => copyToClipboard(token.contractAddress)}>
                        <Copy size={12} className="text-gray-400 hover:text-white" />
                      </button>
                    </div>
                    
                    <div className="w-full sm:w-1/2 flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Wallet:</span>
                      <code className="text-xs">{formatAddress(token.walletAddress)}</code>
                      <button onClick={() => copyToClipboard(token.walletAddress)}>
                        <Copy size={12} className="text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    Status: <span className={`${token.tradingStatus === "Active" ? "text-green-500" : "text-yellow-500"}`}>{token.tradingStatus}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-xs text-gray-400">Token Value</div>
                      <div className={level === 0 ? "text-lg font-bold" : "text-sm font-bold"}>
                        ${typeof token.value === 'number' ? token.value.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400">Balance</div>
                      <div className={level === 0 ? "text-lg font-bold" : "text-sm font-bold"}>
                        {token.balance} INJ
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Profitability</span>
                      <span className="text-xs">{token.profitability}%</span>
                    </div>
                    <div className={`w-full h-${level === 0 ? '2' : '1.5'} rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${token.profitability}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${token.profitability > 70 ? 'bg-green-500' : token.profitability > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Funding Progress</span>
                      <span className="text-xs">{token.fundingProgress}%</span>
                    </div>
                    <div className={`w-full h-${level === 0 ? '2' : '1.5'} rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${token.fundingProgress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xs text-gray-400">Trading Style</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {token.tradingStyle.map(style => (
                        <span key={style} className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                      <div className="font-bold text-sm">{token.winRate}%</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-400">Total Trades</div>
                      <div className="font-bold text-sm">{token.trades}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink size={level === 0 ? 14 : 12} />
                      Injective Explorer
                    </motion.button>
                    
                    {level === 0 && (
                      <>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          <MessageCircle size={14} />
                          Discord
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 text-xs py-1 px-2 rounded-full bg-sky-600 hover:bg-sky-700"
                        >
                          <Twitter size={14} />
                          Twitter
                        </motion.button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-2">
                  <div className="text-sm italic text-gray-400 mb-2">Prototype Agent</div>
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-xs`}>
                    <div className="mb-1">• Algorithm: <span className="text-gray-500">In Development</span></div>
                    <div className="mb-1">• Trading Style: <span className="text-gray-500">{token.tradingStyle[0]}</span></div>
                    <div>• Funding Target: <span className="text-gray-500">Pending</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div className="pl-8 border-l-2 border-dashed border-gray-600 ml-8">
            {token.children.map(child => renderTokenCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Injective Trading Arena</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            {!walletConnected ? (
              <button 
                onClick={connectWallet}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-md">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{formatAddress(walletAddress)}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`px-4 py-2 rounded-md w-full sm:w-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
            />
            
            <div className="flex gap-2">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Trading</option>
                <option value="completed">Completed Funding</option>
                <option value="prototype">Prototype Agents</option>
              </select>
              
              <select 
                value={selectedGeneration}
                onChange={(e) => setSelectedGeneration(e.target.value)}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}
              >
                <option value="all">All Generations</option>
                <option value="GEN_1">Generation 1</option>
                <option value="GEN_2">Generation 2</option>
                <option value="GEN_3">Generation 3</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm mt-2 sm:mt-0">
            <span className="text-gray-400">Last updated: </span>
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Family Tree Visualization */}
        <div className="mb-8">
          {/* Render each GEN_1 token */}
          {tokens.gen1.map(token => renderTokenCard(token))}
        </div>
      </main>
    </div>
  );
};

export default TokenTreeVisualization;