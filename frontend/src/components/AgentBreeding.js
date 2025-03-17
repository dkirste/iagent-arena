import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaVoteYea, FaRobot, FaDna, FaCheck } from 'react-icons/fa';

// Import mock data
import { agents } from '../utils/mockData';

const BreedingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: calc(100vh - 80px);
  overflow: auto;
  
  h1 {
    margin-bottom: 1rem;
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  p.description {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 2rem;
    max-width: 800px;
    line-height: 1.6;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }
`;

const BreedingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const BreedingCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-container {
    margin-bottom: 1.5rem;
  }
  
  .progress-bar {
    height: 8px;
    background-color: ${({ theme }) => theme.backgroundTertiary};
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    background-color: ${({ theme }) => theme.breeding};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  
  .time-remaining {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 0.5rem;
  }
`;

const AttributeList = styled.div`
  margin-bottom: 1.5rem;
  
  .attribute {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    
    .label {
      color: ${({ theme }) => theme.textSecondary};
    }
    
    .value {
      color: ${({ theme }) => theme.text};
      font-weight: 500;
    }
  }
`;

const ParentInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .parent {
    flex: 1;
    padding: 0.8rem;
    background-color: ${({ theme }) => theme.backgroundTertiary};
    border-radius: 0.5rem;
    
    .parent-title {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.textSecondary};
      margin-bottom: 0.3rem;
    }
    
    .parent-name {
      font-weight: 500;
      color: ${({ theme }) => theme.text};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const VotingSection = styled.div`
  margin-top: 3rem;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 1rem;
  padding: 2rem;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 2rem;
    max-width: 800px;
    line-height: 1.6;
  }
`;

const VotingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const VotingCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 0.8rem;
  padding: 1.5rem;
  transition: transform 0.2s;
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }
  
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const VoteOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${({ theme, selected }) => selected ? theme.primary + '33' : theme.background};
  border: 1px solid ${({ theme, selected }) => selected ? theme.primary : theme.backgroundSecondary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  .option-text {
    color: ${({ theme }) => theme.text};
    font-weight: ${({ selected }) => selected ? '600' : '400'};
  }
  
  .vote-count {
    background-color: ${({ theme, selected }) => selected ? theme.primary : theme.backgroundSecondary};
    color: ${({ theme, selected }) => selected ? theme.background : theme.textSecondary};
    padding: 0.3rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  &:hover {
    background-color: ${({ theme, selected }) => selected ? theme.primary + '33' : theme.backgroundSecondary};
  }
  
  .check-icon {
    color: ${({ theme }) => theme.primary};
    visibility: ${({ selected }) => selected ? 'visible' : 'hidden'};
  }
`;

const SubmitVoteButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 2rem;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

// Mock breeding pairs
const breedingPairs = [
  {
    id: 1,
    name: "Alpha-Beta Fusion",
    progress: 68,
    timeRemaining: "14 hours",
    attributes: {
      intelligence: "High",
      riskTolerance: "Medium",
      adaptability: "Very High",
      specialization: "Market Analysis"
    },
    parents: [
      { id: 1, name: "Alpha Predictor" },
      { id: 3, name: "Beta Maximizer" }
    ]
  },
  {
    id: 2,
    name: "Gamma-Delta Hybrid",
    progress: 42,
    timeRemaining: "1 day, 6 hours",
    attributes: {
      intelligence: "Very High",
      riskTolerance: "Low",
      adaptability: "Medium",
      specialization: "Risk Management"
    },
    parents: [
      { id: 5, name: "Gamma Analyzer" },
      { id: 7, name: "Delta Optimizer" }
    ]
  },
  {
    id: 3,
    name: "Epsilon-Zeta Blend",
    progress: 89,
    timeRemaining: "5 hours",
    attributes: {
      intelligence: "Medium",
      riskTolerance: "High",
      adaptability: "High",
      specialization: "Trend Detection"
    },
    parents: [
      { id: 9, name: "Epsilon Scanner" },
      { id: 11, name: "Zeta Trader" }
    ]
  }
];

// Mock voting options
const votingOptions = [
  {
    id: 1,
    attribute: "Intelligence Level",
    options: [
      { id: 1, text: "Very High", votes: 245 },
      { id: 2, text: "High", votes: 189 },
      { id: 3, text: "Medium", votes: 78 },
      { id: 4, text: "Low", votes: 12 }
    ]
  },
  {
    id: 2,
    attribute: "Risk Tolerance",
    options: [
      { id: 1, text: "Very High", votes: 102 },
      { id: 2, text: "High", votes: 167 },
      { id: 3, text: "Medium", votes: 213 },
      { id: 4, text: "Low", votes: 98 }
    ]
  },
  {
    id: 3,
    attribute: "Trading Style",
    options: [
      { id: 1, text: "Aggressive", votes: 156 },
      { id: 2, text: "Balanced", votes: 234 },
      { id: 3, text: "Conservative", votes: 87 },
      { id: 4, text: "Experimental", votes: 103 }
    ]
  },
  {
    id: 4,
    attribute: "Specialization",
    options: [
      { id: 1, text: "Market Analysis", votes: 178 },
      { id: 2, text: "Trend Detection", votes: 201 },
      { id: 3, text: "Risk Management", votes: 145 },
      { id: 4, text: "Arbitrage", votes: 56 }
    ]
  }
];

const AgentBreeding = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [breedingData, setBreedingData] = useState(breedingPairs);
  
  // Update breeding progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBreedingData(prevData => 
        prevData.map(pair => {
          let newProgress = pair.progress + Math.random() * 2;
          let newTimeRemaining = pair.timeRemaining;
          
          // Handle completion
          if (newProgress >= 100) {
            newProgress = 100;
            newTimeRemaining = "Ready!";
          }
          
          return {
            ...pair,
            progress: newProgress,
            timeRemaining: newTimeRemaining
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleVote = (attributeId, optionId) => {
    setVotes(prev => ({
      ...prev,
      [attributeId]: optionId
    }));
  };
  
  const handleSubmitVotes = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setHasVoted(true);
      
      // Update vote counts in the UI
      votingOptions.forEach(attribute => {
        const selectedOption = votes[attribute.id];
        if (selectedOption) {
          const option = attribute.options.find(opt => opt.id === selectedOption);
          if (option) {
            option.votes += 1;
          }
        }
      });
      
      // Show success message
      alert("Thank you for voting! Your preferences will influence the next generation of AI agents.");
    }, 1500);
  };
  
  const allAttributesVoted = votingOptions.every(attr => votes[attr.id]);
  
  return (
    <BreedingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </BackButton>
      
      <h1><FaDna /> Agent Breeding Program</h1>
      <p className="description">
        Welcome to the Agent Breeding Program. Here you can monitor ongoing breeding processes and vote on attributes for the next generation of AI trading agents. Your votes directly influence the genetic makeup of future agents.
      </p>
      
      <h2>Currently Breeding</h2>
      <BreedingGrid>
        {breedingData.map(pair => (
          <BreedingCard key={pair.id}>
            <h3><FaRobot /> {pair.name}</h3>
            
            <ParentInfo>
              <div className="parent">
                <div className="parent-title">Parent 1</div>
                <div className="parent-name">{pair.parents[0].name}</div>
              </div>
              <div className="parent">
                <div className="parent-title">Parent 2</div>
                <div className="parent-name">{pair.parents[1].name}</div>
              </div>
            </ParentInfo>
            
            <AttributeList>
              {Object.entries(pair.attributes).map(([key, value]) => (
                <div className="attribute" key={key}>
                  <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="value">{value}</span>
                </div>
              ))}
            </AttributeList>
            
            <div className="progress-container">
              <div className="progress-label">
                <span>Breeding Progress</span>
                <span>{Math.min(100, Math.round(pair.progress))}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, Math.round(pair.progress))}%` }}
                ></div>
              </div>
              <div className="time-remaining">{pair.timeRemaining}</div>
            </div>
          </BreedingCard>
        ))}
      </BreedingGrid>
      
      <VotingSection>
        <h2><FaVoteYea /> Vote on Next Generation</h2>
        <p>
          Help shape the future of our AI trading ecosystem by voting on the attributes you want to see in the next generation of agents. The community's collective wisdom will determine which traits become dominant.
        </p>
        
        <VotingGrid>
          {votingOptions.map(attribute => (
            <VotingCard key={attribute.id}>
              <h4>{attribute.attribute}</h4>
              <div className="options">
                {attribute.options.map(option => (
                  <VoteOption 
                    key={option.id} 
                    selected={votes[attribute.id] === option.id}
                    onClick={() => !hasVoted && handleVote(attribute.id, option.id)}
                    disabled={hasVoted}
                  >
                    <span className="option-text">{option.text}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {votes[attribute.id] === option.id && (
                        <FaCheck className="check-icon" size={12} />
                      )}
                      <span className="vote-count">{option.votes}</span>
                    </div>
                  </VoteOption>
                ))}
              </div>
            </VotingCard>
          ))}
        </VotingGrid>
        
        <SubmitVoteButton 
          onClick={handleSubmitVotes} 
          disabled={!allAttributesVoted || isSubmitting || hasVoted}
        >
          {isSubmitting ? 'Submitting...' : hasVoted ? 'Vote Submitted' : 'Submit Votes'}
        </SubmitVoteButton>
      </VotingSection>
    </BreedingContainer>
  );
};

export default AgentBreeding;
