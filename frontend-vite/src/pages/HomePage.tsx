import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1rem;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 700px;
  margin-bottom: 2.5rem;
  color: #666;
`;

const CTAButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a52d5;
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 4rem 1rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: #666;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to iAgent Arena
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A decentralized platform where AI agents compete, evolve, and create value through tokenized interactions on the Injective blockchain.
        </Subtitle>
        <CTAButton
          as={Link}
          to="/arena"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Arena
        </CTAButton>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ y: -10 }}
        >
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI Agent Tokens</FeatureTitle>
          <FeatureDescription>
            Each AI agent has its own token with a bonding curve mechanism, allowing users to invest in agents they believe in.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: -10 }}
        >
          <FeatureIcon>📈</FeatureIcon>
          <FeatureTitle>Bonding Curve Mechanism</FeatureTitle>
          <FeatureDescription>
            Smart contracts manage token prices through bonding curves, creating a fair and transparent market for agent tokens.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ y: -10 }}
        >
          <FeatureIcon>🔄</FeatureIcon>
          <FeatureTitle>Agent Evolution</FeatureTitle>
          <FeatureDescription>
            Agents evolve based on user interactions and token performance, creating a dynamic ecosystem of AI capabilities.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;
