// Contract address on Injective testnet
export const AGENT_CONTRACT_ADDRESS = 'inj12g9jfpjmd3xk2k3zel3hky75lve3w82u5hp5rq';

// Injective testnet chain configuration
export const CHAIN_CONFIG = {
  chainId: "injective-888",
  chainName: "Injective Testnet",
  rpc: "https://testnet.sentry.tm.injective.network:443",
  rest: "https://testnet.sentry.lcd.injective.network",
  bip44: {
    coinType: 60,
  },
  bech32Config: {
    bech32PrefixAccAddr: "inj",
    bech32PrefixAccPub: "injpub",
    bech32PrefixValAddr: "injvaloper",
    bech32PrefixValPub: "injvaloperpub",
    bech32PrefixConsAddr: "injvalcons",
    bech32PrefixConsPub: "injvalconspub",
  },
  currencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "INJ",
      coinMinimalDenom: "inj",
      coinDecimals: 18,
      gasPriceStep: {
        low: 500000000,
        average: 1000000000,
        high: 2000000000,
      },
    },
  ],
  features: ["eth-address-gen", "eth-key-sign"],
  walletUrlForStaking: "https://testnet.hub.injective.network/staking",
};

// Export chain constants for use in other files
export const CHAIN_ID = CHAIN_CONFIG.chainId;
export const RPC_ENDPOINT = CHAIN_CONFIG.rpc;
export const REST_ENDPOINT = CHAIN_CONFIG.rest;

/**
 * Connect to Keplr wallet
 * @returns {Promise<{address: string}>} The wallet address
 */
export const connectKeplrWallet = async () => {
  if (!window.keplr) {
    throw new Error('Keplr wallet extension is not installed');
  }

  try {
    // Suggest the testnet chain to Keplr
    await window.keplr.experimentalSuggestChain(CHAIN_CONFIG);

    // Enable the chain
    await window.keplr.enable(CHAIN_CONFIG.chainId);

    // Get the wallet address
    const key = await window.keplr.getKey(CHAIN_CONFIG.chainId);
    const address = key.bech32Address;

    return { address };
  } catch (error) {
    console.error('Error connecting to Keplr wallet:', error);
    throw new Error(error.message);
  }
};

/**
 * Get the token balance for an agent
 * @param {string} address - The wallet address
 * @returns {Promise<string>} The token balance
 */
export const getAgentTokenBalance = async (address) => {
  try {
    const response = await fetch(`${REST_ENDPOINT}/cosmwasm/wasm/v1/contract/${AGENT_CONTRACT_ADDRESS}/smart/${btoa(JSON.stringify({balance: {address}}))}`); 
    const data = await response.json();
    return data.data.balance;
  } catch (error) {
    console.error('Error getting agent token balance:', error);
    return '0';
  }
};

/**
 * Get the token price
 * @returns {Promise<string>} The token price
 */
export const getTokenPrice = async () => {
  try {
    const response = await fetch(`${REST_ENDPOINT}/cosmwasm/wasm/v1/contract/${AGENT_CONTRACT_ADDRESS}/smart/${btoa(JSON.stringify({token_price: {}}))}`); 
    const data = await response.json();
    return data.data.price;
  } catch (error) {
    console.error('Error getting token price:', error);
    return '0';
  }
};

/**
 * Format INJ amount for display
 * @param {string|number} amount - The amount in the smallest unit
 * @param {number} decimals - Number of decimals to display
 * @returns {string} Formatted amount
 */
export const formatInjAmount = (amount, decimals = 6) => {
  if (!amount) return '0';
  const value = parseFloat(amount) / 10**18;
  return value.toFixed(decimals);
};

/**
 * Format token amount for display
 * @param {string|number} amount - The amount in the smallest unit
 * @param {number} decimals - Number of decimals to display
 * @returns {string} Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 6) => {
  if (!amount) return '0';
  const value = parseFloat(amount) / 10**decimals;
  return value.toFixed(decimals);
};

/**
 * Buy tokens using the connected wallet
 * @param {string} address - The wallet address
 * @param {string} amount - The amount of INJ to spend (in the smallest unit)
 * @returns {Promise<any>} The transaction result
 */
export const buyTokens = async (address, amount) => {
  if (!window.keplr) {
    throw new Error('Keplr wallet extension is not installed');
  }

  try {
    // Enable the chain
    await window.keplr.enable(CHAIN_ID);
    
    // Get the offlineSigner for signing transactions
    const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
    
    // Get a client for interacting with the blockchain
    const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
    const client = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner
    );
    
    // Create the fee
    const fee = {
      amount: [{ denom: 'inj', amount: '10000000000000000' }], // 0.01 INJ as fee
      gas: '20000000',
    };
    
    // Execute the contract - this matches the injectived command from the README
    const result = await client.execute(
      address,
      AGENT_CONTRACT_ADDRESS,
      { buy: {} }, // This is the message from the README
      fee,
      'Buy agent tokens',
      [{ denom: 'inj', amount }] // This is the --amount parameter
    );
    
    return {
      txHash: result.transactionHash || 'Transaction submitted',
      success: true
    };
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw new Error(error.message);
  }
};

/**
 * Sell tokens using the connected wallet
 * @param {string} address - The wallet address
 * @param {string} amount - The amount of tokens to sell
 * @returns {Promise<any>} The transaction result
 */
export const sellTokens = async (address, amount) => {
  if (!window.keplr) {
    throw new Error('Keplr wallet extension is not installed');
  }

  try {
    // Enable the chain
    await window.keplr.enable(CHAIN_ID);
    
    // Get the offlineSigner for signing transactions
    const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
    
    // Get a client for interacting with the blockchain
    const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');
    const client = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner
    );
    
    // Create the fee
    const fee = {
      amount: [{ denom: 'inj', amount: '10000000000000000' }], // 0.01 INJ as fee
      gas: '20000000',
    };
    
    // Execute the contract - this matches the injectived command from the README
    const result = await client.execute(
      address,
      AGENT_CONTRACT_ADDRESS,
      { burn: { amount } }, // This is the message from the README
      fee,
      'Sell agent tokens'
    );
    
    return {
      txHash: result.transactionHash || 'Transaction submitted',
      success: true
    };
  } catch (error) {
    console.error('Error selling tokens:', error);
    throw new Error(error.message);
  }
};
