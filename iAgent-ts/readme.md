
# iAgent with Eliza Quick Start Guide

### Overview

The iAgent SDK is a comprehensive framework for building applications on the Injective Chain, offering:

#### Rich Module Support
- Full coverage of Injective modules (Exchange, Staking, Governance, Bank)
- Pre-built actions for trading, staking, and governance

#### Action Framework
- Template-based system with built-in validation
- Standardized patterns for queries and transactions
- Automated error handling

#### Integration Features
- Native gRPC client integration
- Multi-network support (Mainnet/Testnet)
- Streamlined key management

#### Developer Tools
- TypeScript definitions
- Example implementations
- Modular action creation system

This SDK enables rapid development of secure, reliable applications within Injective's DeFi ecosystem.

### 🔥 What's New

#### Enhanced Trading System Prompts
We've added specialized system prompts for trading operations that provide:
- Improved safety and risk management guidance
- Standardized market terminology handling
- Clear decision-making processes for financial operations
- Comprehensive verification flows for critical transactions

#### New Trading Utilities
- `generateTradingText()` - Generate AI responses optimized for trading contexts
- `enhanceTradingPrompt()` - Customize trading prompts with domain-specific instructions
- Specialized trading actions with built-in safety checks

#### Better Risk Management
- Double verification for critical operations
- Standardized market format handling
- Detailed risk assessment in all trading operations
- Clear execution plans with safety considerations

### Quick Start Guide

**Note:** Requires Node.js version 23 or higher

#### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/InjectiveLabs/iagent-ts
```

2. Install dependencies and build:
```bash
cd iagent-ts
pnpm i --no-frozen-lockfile && pnpm build
```

#### Environment Configuration

1. Create your environment file:
```bash
cp .env.example .env
```

2. Configure your `.env` file:
```plaintext
# Injective Keys and Environment
INJECTIVE_PUBIC_KEY="XXXX"
INJECTIVE_PRIVATE_KEY="XXXX"
EVM_PUBLIC_KEY="XXXX"
INJECTIVE_NETWORK="Mainnet"
OPENAI_API_KEY="sks-x"
# Other application environment variables go here
```

**Note:** Get your OpenAI API key from: https://platform.openai.com/api-keys

#### Running the Application

1. Start the agent server:
```bash
pnpm start
```

2. In a separate terminal, start the client:
```bash
pnpm start:client
```

## Trading System Prompt Integration Guide

This section explains how to integrate and use the enhanced trading system prompt functionality in your iAgent applications.

### Overview

The trading system prompt feature provides specialized guidance to AI models when handling financial and trading operations. It emphasizes:

- Risk management and safety
- Clear explanations of complex concepts
- Standardized market handling
- Proper verification of critical operations
- Comprehensive error handling

### Setup Instructions

#### 1. Add the Required Files

First, add the following files to your project:

- `src/tradingSystemPrompt.ts` - Contains the core trading system prompt
- `src/utils/tradingPromptUtils.ts` - Utilities for working with trading prompts
- Optional: `src/actions/tradeAction.ts` - Example implementation

#### 2. Update Your Generation Code

Modify your existing `generateText` function in `src/generation.ts` to support the trading system prompt, as shown in the code examples.

#### 3. Register Trading Actions

To use trading-specific actions, register them in your agent runtime:

```typescript
import { tradeAction } from './actions/tradeAction';

// Inside your setup code
runtime.registerAction(tradeAction);
```

### Usage Examples

#### Basic Usage

To generate text with the trading system prompt:

```typescript
import { generateTradingText } from './utils/tradingPromptUtils';

const response = await generateTradingText({
  runtime,
  context: "Analyze the current BTC market conditions and suggest entry points",
  modelClass: ModelClass.LARGE
});
```

#### Custom Trading Instructions

You can enhance the base trading prompt with specific instructions:

```typescript
import { enhanceTradingPrompt } from './utils/tradingPromptUtils';
import { tradingSystemPrompt } from './tradingSystemPrompt';

const customPrompt = enhanceTradingPrompt(
  tradingSystemPrompt,
  `
  SPECIFIC MARKET CONTEXT:
  - Focus on Ethereum-based assets
  - Consider gas fees in calculations
  - Prioritize long-term positions over short-term trades
  `
);

const response = await generateTradingText({
  runtime,
  context: userQuery,
  customTradingPrompt: customPrompt
});
```

#### Creating Trading-Focused Actions

When creating trading-specific actions:

1. Use the `generateTradingText` utility for all AI responses
2. Implement thorough validation to ensure trading intent
3. Include safety checks before executing trades
4. Provide clear feedback to users about risks and outcomes




# Injective Hackathon
Submission for Injective AI Agent Hackathon

## iAgent with Eliza Quick Start Guide

### Overview

The iAgent SDK is a comprehensive framework for building applications on the Injective Chain, offering:

#### Rich Module Support
- Full coverage of Injective modules (Exchange, Staking, Governance, Bank)
- Pre-built actions for trading, staking, and governance

#### Action Framework
- Template-based system with built-in validation
- Standardized patterns for queries and transactions
- Automated error handling

#### Integration Features
- Native gRPC client integration
- Multi-network support (Mainnet/Testnet)
- Streamlined key management

#### Developer Tools
- TypeScript definitions
- Example implementations
- Modular action creation system

This SDK enables rapid development of secure, reliable applications within Injective's DeFi ecosystem.

### 🔥 What's New

#### Enhanced Trading System Prompts
We've added specialized system prompts for trading operations that provide:
- Improved safety and risk management guidance
- Standardized market terminology handling
- Clear decision-making processes for financial operations
- Comprehensive verification flows for critical transactions

#### New Trading Utilities
- `generateTradingText()` - Generate AI responses optimized for trading contexts
- `enhanceTradingPrompt()` - Customize trading prompts with domain-specific instructions
- Specialized trading actions with built-in safety checks

#### Better Risk Management
- Double verification for critical operations
- Standardized market format handling
- Detailed risk assessment in all trading operations
- Clear execution plans with safety considerations


### Testing the Advanced Trading System Prompts

To test what we did with the advanced trading system prompts, you'll need to run the application and try out the advanced queries. Here's how to do that:

#### Test with Advanced Queries

Once your application is running, you can input these advanced queries to test the enhanced trading system prompts:

1. **Complex Position with Risk Management:**
```
I'd like to open a long position on ETH/USDT with 3x leverage, using 20% of my available balance, and set a stop loss at 5% below entry
```

2. **Position Sizing with Risk Parameters:**
```
What position size should I use for a BTC short with 5x leverage if I'm willing to risk 2% of my $10,000 portfolio?
```

3. **Market Analysis with Strategy:**
```
Analyze the current ETH/USDT market conditions and suggest entry points for a long position with target profit levels
```

4. **Portfolio Allocation:**
```
I have $5,000 in my account. Suggest how I should allocate it between BTC, ETH, and INJ for a balanced trading portfolio
```

5. **Trade Management Decision:**
```
I have a long BTC position that's currently 10% in profit. Should I take profits now or set a trailing stop loss?
```

The system should now respond with enhanced trading-focused responses that include:
* Clear risk assessments
* Standardized market terminology
* Step-by-step execution plans
* Safety considerations
* Explicit verification requirements for critical operations

You should see a noticeable improvement in the quality and safety focus of the responses compared to the generic system prompt.

If you encounter any issues with the implementation, make sure all the new code files are properly integrated and that the `useTradingPrompt` parameter is being set to `true` when generating responses for trading-related queries.



### Advanced Configuration

#### Character Configuration

##### Default Character
To modify the default character, edit `src/character.ts`

##### Custom Characters
Load custom character configurations:
```bash
pnpm start --characters="path/to/your/character.json"
```
**Note:** Multiple character files can be loaded simultaneously

#### Client Configuration

You can configure clients in two ways:

1. In `character.ts`:
```typescript
clients: [Clients.TWITTER, Clients.DISCORD],
plugins: [injectivePlugin]
```

2. In `character.json`:
```json
{
  "clients": ["twitter", "discord"]
}
```

## Best Practices

### Safety First

- Always validate user inputs thoroughly
- Double-check addresses and transaction parameters
- Use appropriate model sizes for complex financial analysis
- Never execute trades without explicit user confirmation

### Clear Communication

- Explain risks and trade-offs clearly
- Break down complex financial concepts
- Provide step-by-step plans for critical operations
- Offer alternatives when appropriate

### Error Handling

- Catch and log all errors
- Provide helpful error messages to users
- Never leave transactions in an ambiguous state
- Include recovery suggestions when issues occur

### Development Best Practices

1. Always use TypeScript for type safety
2. Follow the template patterns for new actions
3. Implement proper error handling
4. Test on testnet before deploying to mainnet
5. Use trading-specific prompts for all financial operations

## Troubleshooting

### Common Issues

- **Model Responses Too Generic**: Try increasing the model size or adding more specific context in your prompt
- **Safety Checks Too Restrictive**: Adjust validation logic to better match your use case
- **Performance Issues**: Consider caching market data and using smaller models for initial analysis
- **Connection Issues**: Verify network configuration and API key validity
- **Transaction Failures**: Check account balance, gas settings, and transaction parameters
- **Trading Response Quality**: Try increasing the model size or add more market context

### Logging

Always enable detailed logging for trading operations:

```typescript
elizaLogger.info("Trading operation details:", {
  operation: "market_buy",
  asset: "BTC/USDT",
  amount: "0.1",
  userID: userId
});
```

## Next Steps

1. Explore the example implementations
2. Review the API documentation
3. Join the developer community
4. Build your first application
5. Check out the Trading System Prompt

For more detailed information, refer to:
- Official Documentation
- API Reference
- Community Forums
- Developer Discord

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Follow the code style guidelines

## Support

For support:
- GitHub Issues
- Developer Discord
- Community Forums
- Documentation Wiki
