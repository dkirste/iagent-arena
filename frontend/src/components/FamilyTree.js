import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import * as d3 from 'd3';

// Import mock data
import { agents, agentRelationships } from '../utils/mockData';

const FamilyTreeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: calc(100vh - 80px);
  overflow: auto;
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
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

const GraphContainer = styled.div`
  width: 100%;
  height: 700px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  .node {
    cursor: pointer;
    
    circle {
      fill: ${({ theme }) => theme.primary};
      stroke: ${({ theme }) => theme.backgroundTertiary};
      stroke-width: 2px;
      transition: all 0.3s;
    }
    
    &:hover circle {
      fill: ${({ theme }) => theme.secondary};
      r: 12;
    }
    
    text {
      font-size: 12px;
      fill: ${({ theme }) => theme.text};
      text-anchor: middle;
      pointer-events: none;
      user-select: none;
    }
  }
  
  .link {
    stroke: ${({ theme }) => theme.backgroundTertiary};
    stroke-width: 2px;
  }
  
  .alive circle {
    fill: ${({ theme }) => theme.alive};
  }
  
  .breeding circle {
    fill: ${({ theme }) => theme.breeding};
  }
  
  .dead circle {
    fill: ${({ theme }) => theme.danger};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .message {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text};
  }
  
  .sub-message {
    font-size: 1rem;
    color: ${({ theme }) => theme.textSecondary};
    max-width: 500px;
  }
`;

const FamilyTree = () => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState(null);
  
  // Define renderGraph with useCallback to avoid dependency issues
  const renderGraph = useCallback((data) => {
    try {
      if (!svgRef.current) {
        console.error('SVG reference is not available');
        setError('Failed to render family tree - SVG container not found');
        return;
      }
      
      // Clear previous graph
      d3.select(svgRef.current).selectAll('*').remove();
      
      const width = svgRef.current.clientWidth || 800;
      const height = svgRef.current.clientHeight || 600;
      
      console.log('Rendering graph with dimensions:', width, height);
      console.log('Data:', data);
      
      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);
      
      // Create force simulation
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));
      
      // Add links
      const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('class', 'link');
      
      // Add nodes
      const node = svg.append('g')
        .selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class', d => `node ${d.status || 'unknown'}`)
        .on('click', (event, d) => {
          navigate(`/agent/${d.id}`);
        });
      
      // Add circles to nodes
      node.append('circle')
        .attr('r', 10);
      
      // Add labels to nodes
      node.append('text')
        .attr('dy', 25)
        .text(d => `${d.name} (Gen ${d.generation})`);
      
      // Add generation labels
      node.append('text')
        .attr('dy', -15)
        .text(d => `#${d.id}`);
      
      // Update positions on tick
      simulation.on('tick', () => {
        // Constrain nodes to the SVG bounds with padding
        data.nodes.forEach(d => {
          d.x = Math.max(50, Math.min(width - 50, d.x || width/2));
          d.y = Math.max(50, Math.min(height - 50, d.y || height/2));
        });
        
        link
          .attr('x1', d => d.source.x || 0)
          .attr('y1', d => d.source.y || 0)
          .attr('x2', d => d.target.x || 0)
          .attr('y2', d => d.target.y || 0);
        
        node
          .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
      });
      
      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          svg.selectAll('g').attr('transform', event.transform);
        });
      
      svg.call(zoom);
      
      // Initial zoom to fit all nodes
      const initialScale = 0.8;
      svg.call(zoom.transform, d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2));
    } catch (err) {
      console.error('Error rendering graph:', err);
      setError('Failed to render family tree: ' + err.message);
    }
  }, [navigate]);
  
  // Process data on component mount
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if data is available
      if (!agents || !Array.isArray(agents) || agents.length === 0) {
        setError('No agent data available');
        setIsLoading(false);
        return;
      }
      
      if (!agentRelationships || !Array.isArray(agentRelationships) || agentRelationships.length === 0) {
        setError('No relationship data available');
        setIsLoading(false);
        return;
      }
      
      // Create a safe copy of the data
      const safeAgents = agents.map(agent => ({
        id: agent.id || 0,
        name: agent.name || `Agent ${agent.id || 'Unknown'}`,
        status: agent.status || 'unknown',
        generation: agent.generation || 1
      }));
      
      const safeRelationships = agentRelationships
        .filter(rel => 
          rel && 
          typeof rel.parent === 'number' && 
          typeof rel.child === 'number' &&
          safeAgents.some(a => a.id === rel.parent) &&
          safeAgents.some(a => a.id === rel.child)
        )
        .map(rel => ({
          source: rel.parent,
          target: rel.child
        }));
      
      // Create graph data
      const data = {
        nodes: safeAgents,
        links: safeRelationships
      };
      
      setGraphData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing family tree data:', err);
      setError('Failed to process family tree data: ' + err.message);
      setIsLoading(false);
    }
  }, []);
  
  // Render graph when data is ready and component is mounted
  useEffect(() => {
    if (!isLoading && !error && graphData && svgRef.current) {
      // Add a small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        try {
          renderGraph(graphData);
        } catch (err) {
          console.error('Error rendering graph:', err);
          setError('Failed to render family tree: ' + err.message);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, graphData, renderGraph]);
  
  // Show loading state
  if (isLoading) {
    return (
      <FamilyTreeContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <h1>AI Agent Family Tree</h1>
        
        <EmptyState>
          <div className="icon">⏳</div>
          <div className="message">Loading Family Tree...</div>
          <div className="sub-message">Please wait while we map the relationships between agents.</div>
        </EmptyState>
      </FamilyTreeContainer>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <FamilyTreeContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Dashboard
        </BackButton>
        
        <h1>AI Agent Family Tree</h1>
        
        <EmptyState>
          <div className="icon">🔍</div>
          <div className="message">No Family Tree Data</div>
          <div className="sub-message">{error}</div>
        </EmptyState>
      </FamilyTreeContainer>
    );
  }
  
  return (
    <FamilyTreeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </BackButton>
      
      <h1>AI Agent Family Tree</h1>
      
      <GraphContainer>
        <svg ref={svgRef}></svg>
      </GraphContainer>
    </FamilyTreeContainer>
  );
};

export default FamilyTree;
