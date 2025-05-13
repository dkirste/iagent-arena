import { 
  ChainId,
  getNetworkEndpoints,
  Network,
  MsgExecuteContractCompat
} from '@injectivelabs/sdk-ts';
import { 
  WalletStrategy,
  Wallet,
  ConcreteWalletStrategy 
} from '@injectivelabs/wallet-ts';

// Configure network and endpoints
const network = Network.TestnetK8s;
const chainId = ChainId.Testnet;
const endpoints = getNetworkEndpoints(network);

// Initialize wallet strategy
const walletStrategy = new WalletStrategy({
  chainId,
  wallet: Wallet.Keplr,
});

/**
 * Service for interacting with the Injective blockchain
 */
export class InjectiveService {
  private static instance: InjectiveService;
  private walletStrategy: ConcreteWalletStrategy;
  private address: string = '';
  private isConnected: boolean = false;

  private constructor() {
    this.walletStrategy = walletStrategy;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): InjectiveService {
    if (!InjectiveService.instance) {
      InjectiveService.instance = new InjectiveService();
    }
    return InjectiveService.instance;
  }

  /**
   * Connect wallet
   */
  public async connectWallet(): Promise<string> {
    try {
      const addresses = await this.walletStrategy.getAddresses();
      this.address = addresses[0];
      this.isConnected = true;
      return this.address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  public disconnectWallet(): void {
    this.address = '';
    this.isConnected = false;
  }

  /**
   * Get connected wallet address
   */
  public getAddress(): string {
    return this.address;
  }

  /**
   * Check if wallet is connected
   */
  public isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Execute smart contract function
   * @param contractAddress - The address of the smart contract
   * @param msg - The message to send to the contract
   * @param funds - Optional funds to send with the message
   */
  public async executeContract(
    contractAddress: string,
    msg: Record<string, unknown>,
    funds?: { denom: string; amount: string }[]
  ): Promise<string> {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      const message = MsgExecuteContractCompat.fromJSON({
        sender: this.address,
        contractAddress,
        msg,
        funds,
      });

      // Sign and broadcast the transaction
      const txResponse = await this.walletStrategy.signAndBroadcast({
        msgs: [message],
        injectiveAddress: this.address,
      });

      return txResponse.txHash;
    } catch (error) {
      console.error('Failed to execute contract:', error);
      throw error;
    }
  }

  /**
   * Query smart contract state
   * @param contractAddress - The address of the smart contract
   * @param query - The query to send to the contract
   */
  public async queryContract(
    contractAddress: string,
    query: Record<string, unknown>
  ): Promise<any> {
    try {
      // Implementation using the Injective SDK
      // This is a placeholder for the actual implementation
      const response = await fetch(`${endpoints.rest}/cosmos/wasm/v1/contract/${contractAddress}/smart/${btoa(JSON.stringify(query))}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to query contract:', error);
      throw error;
    }
  }
}
