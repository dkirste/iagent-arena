import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AgentArenaContract, Agent } from '../contracts/AgentArenaContract';

const ArenaContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-color);
`;

const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AgentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const AgentName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const AgentDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const AgentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const StatValue = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const BuyButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;

  &:hover {
    background-color: #5a52d5;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SellButton = styled(Button)`
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);

  &:hover {
    background-color: rgba(108, 99, 255, 0.1);
  }

  &:disabled {
    border-color: #ccc;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const CreateAgentSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  grid-column: 1 / -1;

  &:hover {
    background-color: #5a52d5;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const WalletRequiredMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MessageTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const MessageText = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const ConnectButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a52d5;
  }
`;

interface AgentArenaPageProps {
  walletConnected: boolean;
}

const AgentArenaPage = ({ walletConnected }: AgentArenaPageProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenSymbol: '',
    initialPrice: '',
    initialSupply: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize contract with a placeholder address
  // In a real application, this would be fetched from configuration
  const contractAddress = 'inj1contractaddressplaceholder';
  const contract = new AgentArenaContract(contractAddress);

  useEffect(() => {
    if (walletConnected) {
      fetchAgents();
    }
  }, [walletConnected]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const agentsData = await contract.getAllAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);
      await contract.createAgent(
        formData.name,
        formData.description,
        formData.tokenSymbol,
        formData.initialPrice,
        formData.initialSupply
      );
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        tokenSymbol: '',
        initialPrice: '',
        initialSupply: ''
      });
      
      // Refresh agents list
      fetchAgents();
      
      alert('Agent created successfully!');
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyTokens = async (agentId: string) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = prompt('Enter amount in INJ to buy:');
    if (!amount) return;

    try {
      await contract.buyTokens(agentId, amount);
      alert('Tokens purchased successfully!');
      fetchAgents();
    } catch (error) {
      console.error('Failed to buy tokens:', error);
      alert('Failed to buy tokens. Please try again.');
    }
  };

  const handleSellTokens = async (agentId: string) => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = prompt('Enter amount of tokens to sell:');
    if (!amount) return;

    try {
      await contract.sellTokens(agentId, amount);
      alert('Tokens sold successfully!');
      fetchAgents();
    } catch (error) {
      console.error('Failed to sell tokens:', error);
      alert('Failed to sell tokens. Please try again.');
    }
  };

  if (!walletConnected) {
    return (
      <ArenaContainer>
        <WalletRequiredMessage>
          <MessageTitle>Connect Your Wallet</MessageTitle>
          <MessageText>
            Please connect your wallet to access the Agent Arena and interact with AI agents.
          </MessageText>
          <ConnectButton>Connect Wallet</ConnectButton>
        </WalletRequiredMessage>
      </ArenaContainer>
    );
  }

  return (
    <ArenaContainer>
      <Title>Agent Arena</Title>
      
      {loading ? (
        <p>Loading agents...</p>
      ) : agents.length === 0 ? (
        <p>No agents found. Be the first to create one!</p>
      ) : (
        <AgentsGrid>
          {agents.map(agent => (
            <AgentCard key={agent.id}>
              <AgentName>{agent.name}</AgentName>
              <AgentDescription>{agent.description}</AgentDescription>
              <AgentStats>
                <StatItem>
                  <StatLabel>Token</StatLabel>
                  <StatValue>{agent.tokenSymbol}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Price</StatLabel>
                  <StatValue>{agent.tokenPrice} INJ</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Market Cap</StatLabel>
                  <StatValue>{agent.marketCap} INJ</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Supply</StatLabel>
                  <StatValue>{agent.totalSupply}</StatValue>
                </StatItem>
              </AgentStats>
              <ButtonGroup>
                <BuyButton onClick={() => handleBuyTokens(agent.id)}>Buy</BuyButton>
                <SellButton onClick={() => handleSellTokens(agent.id)}>Sell</SellButton>
              </ButtonGroup>
            </AgentCard>
          ))}
        </AgentsGrid>
      )}

      <CreateAgentSection>
        <SectionTitle>Create New Agent</SectionTitle>
        <Form onSubmit={handleCreateAgent}>
          <FormGroup>
            <Label htmlFor="name">Agent Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              type="text"
              id="tokenSymbol"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="initialPrice">Initial Price (INJ)</Label>
            <Input
              type="number"
              id="initialPrice"
              name="initialPrice"
              value={formData.initialPrice}
              onChange={handleInputChange}
              step="0.000001"
              min="0.000001"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="initialSupply">Initial Supply</Label>
            <Input
              type="number"
              id="initialSupply"
              name="initialSupply"
              value={formData.initialSupply}
              onChange={handleInputChange}
              step="1"
              min="1"
              required
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Agent'}
          </SubmitButton>
        </Form>
      </CreateAgentSection>
    </ArenaContainer>
  );
};

export default AgentArenaPage;
