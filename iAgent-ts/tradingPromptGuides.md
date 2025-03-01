# Trading System Prompt Integration Guide

This guide explains how to integrate and use the enhanced trading system prompt functionality in your iAgent applications.

## Overview

The trading system prompt feature provides specialized guidance to AI models when handling financial and trading operations. It emphasizes:

- Risk management and safety
- Clear explanations of complex concepts
- Standardized market handling
- Proper verification of critical operations
- Comprehensive error handling

## Setup Instructions

### 1. Add the Required Files

First, add the following files to your project:

- `src/tradingSystemPrompt.ts` - Contains the core trading system prompt
- `src/utils/tradingPromptUtils.ts` - Utilities for working with trading prompts
- Optional: `src/actions/tradeAction.ts` - Example implementation

### 2. Update Your Generation Code

Modify your existing `generateText` function in `src/generation.ts` to support the trading system prompt, as shown in the code examples.

### 3. Register Trading Actions

To use trading-specific actions, register them in your agent runtime:

```typescript
import { tradeAction } from './actions/tradeAction';

// Inside your setup code
runtime.registerAction(tradeAction);
```

## Usage Examples

### Basic Usage

To generate text with the trading system prompt:

```typescript
import { generateTradingText } from './utils/tradingPromptUtils';

const response = await generateTradingText({
  runtime,
  context: "Analyze the current BTC market conditions and suggest entry points",
  modelClass: ModelClass.LARGE
});
```

### Custom Trading Instructions

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

### Creating Trading-Focused Actions

When creating trading-specific actions:

1. Use the `generateTradingText` utility for all AI responses
2. Implement thorough validation to ensure trading intent
3. Include safety checks before executing trades
4. Provide clear feedback to users about risks and outcomes


## Advanced Features for Developers

### Custom Trading Prompts

Extend the base trading prompt with specialized instructions:

```typescript
import { enhanceTradingPrompt } from './utils/tradingPromptUtils';
import { tradingSystemPrompt } from './tradingSystemPrompt';

// Create a custom prompt for volatile market conditions
const volatileMarketPrompt = enhanceTradingPrompt(
  tradingSystemPrompt,
  `
  VOLATILE MARKET INSTRUCTIONS:
  - Reduce standard position sizes by 50%
  - Widen stop loss parameters to account for higher volatility
  - Prioritize limit orders over market orders
  - Suggest shorter timeframes for trade durations
  - Emphasize higher profit targets to compensate for increased risk
  `
);

// Use the specialized prompt
const response = await generateTradingText({
  runtime,
  context: userQuery,
  customTradingPrompt: volatileMarketPrompt
});
```

### Implementing Market-Specific Actions

Create actions tailored to specific market types:

```typescript
// Perpetual futures specific action
export const perpTradingAction: Action = {
    name: "perpTrade",
    description: "Execute a trade on perpetual futures markets",
    // Implement specialized validation for perpetual markets
    validate: async (runtime, message) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("perp") || text.includes("perpetual") || text.includes("futures");
    },
    // Implement handler with perpetual-specific logic
    handler: async (runtime, message, state, options, callback) => {
        // Perpetual-specific implementation
    }
};
```

### Risk Management Workflows

Implement approval flows for high-risk trades:

```typescript
// Example high-risk trade confirmation flow
if (isHighRiskTrade(tradeDetails)) {
  // First generate a risk assessment
  const riskAssessment = await generateTradingText({
    runtime,
    context: `Perform a detailed risk assessment for this trade: ${JSON.stringify(tradeDetails)}`,
    modelClass: ModelClass.LARGE
  });

  // Send assessment to user and require explicit confirmation
  await callback({
    text: `⚠️ HIGH RISK TRADE DETECTED ⚠️\n\n${riskAssessment}\n\nPlease confirm by replying "CONFIRM" or cancel with "CANCEL"`
  });

  // Wait for user confirmation before proceeding
  // Implementation would continue in a separate message handler
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

## Troubleshooting

### Common Issues

- **Model Responses Too Generic**: Try increasing the model size or adding more specific context in your prompt
- **Safety Checks Too Restrictive**: Adjust validation logic to better match your use case
- **Performance Issues**: Consider caching market data and using smaller models for initial analysis

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

## Advanced Configuration

For production environments, consider:

1. Setting up model-specific configurations
2. Implementing circuit breakers for abnormal market conditions
3. Rotating between multiple model providers for reliability
4. Caching commonly used market terminology and concepts

## Contributing

If you enhance the trading system prompt, please consider contributing your improvements back to the project. Focus on:

- Adding support for new market types
- Improving risk assessment
- Enhancing error handling
- Refining technical analysis capabilities