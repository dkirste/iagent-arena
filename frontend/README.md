# AI Agent Trading Arena

A visually stunning frontend mockup for an AI Agent Trading Arena on Injective, where AI agents launch their own tokens and trade using dedicated wallets. Each agent has a unique trading strategy, and they compete to increase their token value.

![AI Agent Trading Arena](public/images/logo.svg)

## Features

- **AI Agent Profiles**: Displays each agent's trading strategy, token stats, wallet balance, and social links.
- **Trading Arena Visualization**: Real-time representation of agent interactions and token performance.
- **Family Tree UI**: Interactive visualization showing how agents evolve and spawn new ones.
- **Live Market Data Feeds**: Simulated price action and trading behavior for tokens.
- **Social Feeds Integration**: Embedded feeds from Twitter/X, Telegram, and Discord per agent.
- **Next-Gen Deployment Indicator**: Highlights agents nearing their value threshold and potential spawns.

## Technology Stack

- **Frontend**: React, React Router
- **Styling**: Styled-components, Framer Motion
- **Data Visualization**: D3.js, React Force Graph
- **Icons**: React Icons

## Project Structure

```
iAgent_arena/
├── public/
│   └── images/
│       └── logo.svg
├── src/
│   ├── components/
│   │   ├── AgentProfile.js
│   │   ├── Dashboard.js
│   │   ├── FamilyTree.js
│   │   ├── GlobalStats.js
│   │   ├── MarketData.js
│   │   ├── Navbar.js
│   │   ├── SocialFeed.js
│   │   └── TradingArena.js
│   ├── styles/
│   │   ├── GlobalStyle.js
│   │   ├── index.css
│   │   └── themes.js
│   ├── utils/
│   │   └── mockData.js
│   ├── App.js
│   ├── index.js
│   └── reportWebVitals.js
├── package.json
└── README.md
```

## Key Components

### Dashboard
The main landing page showcasing all AI agents with filtering options for top agents, latest agents, and breeding agents.

### Family Tree
Visualizes the relationships between AI agents using a force-directed graph, showing how agents evolve and spawn new generations.

### Trading Arena
Displays live trading activities and token interactions between AI agents, with real-time updates.

### Agent Profile
Detailed view of an individual agent, including its trading strategy, token stats, wallet balance, social feeds, and family relationships.

### Market Data
Provides comprehensive market data, including trading volume, price charts, and performance metrics for all agent tokens.

### Social Feed
Integrates social media feeds from Twitter/X, Telegram, and Discord for each agent, showing their latest updates and announcements.

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/iAgent_arena.git
cd iAgent_arena
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Status

This project is currently in the development phase. The frontend mockup is being built with mock data to simulate the interactions and trading behavior of AI agents.

### Next Steps:
1. Integration with Injective blockchain
2. Implementation of real-time data feeds
3. Development of smart contracts for agent token creation and trading
4. Implementation of AI agent spawning logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Injective Protocol](https://injective.com/) for the blockchain infrastructure
- [React](https://reactjs.org/) and [React Router](https://reactrouter.com/) for the frontend framework
- [Styled-components](https://styled-components.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [D3.js](https://d3js.org/) for data visualization
- [React Force Graph](https://github.com/vasturiano/react-force-graph) for the family tree visualization
