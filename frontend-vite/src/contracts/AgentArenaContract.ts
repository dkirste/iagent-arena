import { InjectiveService } from '../services/injectiveService';

/**
 * Interface for Agent data
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  tokenSymbol: string;
  tokenPrice: string;
  marketCap: string;
  totalSupply: string;
  reserveBalance: string;
}

/**
 * Class for interacting with the Agent Arena smart contract
 */
export class AgentArenaContract {
  private contractAddress: string;
  private injectiveService: InjectiveService;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
    this.injectiveService = InjectiveService.getInstance();
  }

  /**
   * Get all agents from the contract
   */
  async getAllAgents(): Promise<Agent[]> {
    try {
      const response = await this.injectiveService.queryContract(
        this.contractAddress,
        { get_all_agents: {} }
      );
      return response.agents || [];
    } catch (error) {
      console.error('Failed to get agents:', error);
      return [];
    }
  }

  /**
   * Get a specific agent by ID
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    try {
      const response = await this.injectiveService.queryContract(
        this.contractAddress,
        { get_agent: { id: agentId } }
      );
      return response.agent || null;
    } catch (error) {
      console.error(`Failed to get agent ${agentId}:`, error);
      return null;
    }
  }

  /**
   * Buy tokens for a specific agent
   */
  async buyTokens(agentId: string, amount: string): Promise<string> {
    try {
      const txHash = await this.injectiveService.executeContract(
        this.contractAddress,
        {
          buy_tokens: {
            agent_id: agentId,
            amount
          }
        },
        [{ denom: 'inj', amount }]
      );
      return txHash;
    } catch (error) {
      console.error(`Failed to buy tokens for agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Sell tokens for a specific agent
   */
  async sellTokens(agentId: string, tokenAmount: string): Promise<string> {
    try {
      const txHash = await this.injectiveService.executeContract(
        this.contractAddress,
        {
          sell_tokens: {
            agent_id: agentId,
            amount: tokenAmount
          }
        }
      );
      return txHash;
    } catch (error) {
      console.error(`Failed to sell tokens for agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new agent
   */
  async createAgent(
    name: string,
    description: string,
    tokenSymbol: string,
    initialPrice: string,
    initialSupply: string
  ): Promise<string> {
    try {
      const txHash = await this.injectiveService.executeContract(
        this.contractAddress,
        {
          create_agent: {
            name,
            description,
            token_symbol: tokenSymbol,
            initial_price: initialPrice,
            initial_supply: initialSupply
          }
        }
      );
      return txHash;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw error;
    }
  }

  /**
   * Update agent attributes
   */
  async updateAgentAttributes(
    agentId: string,
    attributes: Record<string, string>
  ): Promise<string> {
    try {
      const txHash = await this.injectiveService.executeContract(
        this.contractAddress,
        {
          update_agent_attributes: {
            agent_id: agentId,
            attributes
          }
        }
      );
      return txHash;
    } catch (error) {
      console.error(`Failed to update attributes for agent ${agentId}:`, error);
      throw error;
    }
  }
}
