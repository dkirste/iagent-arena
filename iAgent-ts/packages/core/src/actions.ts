import { names, uniqueNamesGenerator } from "unique-names-generator";
import  { Action, ActionExample, IAgentRuntime, Memory, ModelClass, State, UUID } from "./types.ts";
import { generateTradingText } from "./tradingPromptUtils.ts";
import { elizaLogger } from "./logger.ts";
/**
 * Composes a set of example conversations based on provided actions and a specified count.
 * It randomly selects examples from the provided actions and formats them with generated names.
 * @param actionsData - An array of `Action` objects from which to draw examples.
 * @param count - The number of examples to generate.
 * @returns A string containing formatted examples of conversations.
 */
export const composeActionExamples = (actionsData: Action[], count: number) => {
    const data: ActionExample[][][] = actionsData.map((action: Action) => [
        ...action.examples,
    ]);

    const actionExamples: ActionExample[][] = [];
    let length = data.length;
    for (let i = 0; i < count && length; i++) {
        const actionId = i % length;
        const examples = data[actionId];
        if (examples.length) {
            const rand = ~~(Math.random() * examples.length);
            actionExamples[i] = examples.splice(rand, 1)[0];
        } else {
            i--;
        }

        if (examples.length == 0) {
            data.splice(actionId, 1);
            length--;
        }
    }

    const formattedExamples = actionExamples.map((example) => {
        const exampleNames = Array.from({ length: 5 }, () =>
            uniqueNamesGenerator({ dictionaries: [names] })
        );

        return `\n${example
            .map((message) => {
                let messageString = `${message.user}: ${message.content.text}${message.content.action ? ` (${message.content.action})` : ""}`;
                for (let i = 0; i < exampleNames.length; i++) {
                    messageString = messageString.replaceAll(
                        `{{user${i + 1}}}`,
                        exampleNames[i]
                    );
                }
                return messageString;
            })
            .join("\n")}`;
    });

    return formattedExamples.join("\n");
};

/**
 * Formats the names of the provided actions into a comma-separated string.
 * @param actions - An array of `Action` objects from which to extract names.
 * @returns A comma-separated string of action names.
 */
export function formatActionNames(actions: Action[]) {
    return actions
        .sort(() => 0.5 - Math.random())
        .map((action: Action) => `${action.name}`)
        .join(", ");
}

/**
 * Formats the provided actions into a detailed string listing each action's name and description, separated by commas and newlines.
 * @param actions - An array of `Action` objects to format.
 * @returns A detailed string of actions, including names and descriptions.
 */
export function formatActions(actions: Action[]) {
    return actions
        .sort(() => 0.5 - Math.random())
        .map((action: Action) => `${action.name}: ${action.description}`)
        .join(",\n");
}


/**
 * Trade action for executing trades with enhanced safety
 * This action leverages the specialized trading system prompt
 */
export const tradeAction: Action = {
    name: "trade",
    description: "Execute a trade on the Injective Chain with enhanced safety checks",
    similes: ["execute trade", "place order", "buy", "sell", "long", "short", "trade asset"],
    examples: [
        [
            {
                user: "user1",
                content: { text: "I want to long BTC perpetual with 2x leverage" }
            },
            {
                user: "agent1",
                content: {
                    text: "I'll help you open a long position on BTC/USDT perpetual with 2x leverage. Before proceeding, let me verify your available balance and explain the risks involved.",
                    action: "trade"
                }
            }
        ],
        [
            {
                user: "user1",
                content: { text: "Sell 0.5 ETH at market price" }
            },
            {
                user: "agent1",
                content: {
                    text: "I'll help you sell 0.5 ETH at market price. Let me confirm the current market conditions and execute this trade safely.",
                    action: "trade"
                }
            }
        ]
    ],

    async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        // Check if message contains trading-related keywords
        const text = message.content.text?.toLowerCase() || "";

        const tradingTerms = [
            "trade", "buy", "sell", "long", "short", "leverage", "position",
            "market", "limit", "order", "stop loss", "take profit", "btc", "eth",
            "bitcoin", "ethereum", "usdt", "perp", "perpetual", "futures"
        ];

        return tradingTerms.some(term => text.includes(term));
    },

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: { [key: string]: unknown },
        callback?: (response: { text: string }) => Promise<Memory[]>
    ): Promise<void> {
        const userId = message.userId;
        const roomId = message.roomId;

        try {
            // Initial response to acknowledge the request
            if (callback) {
                await callback({
                    text: "I'm analyzing your trading request to ensure it's executed safely. One moment please..."
                });
            }

            // Prepare a context that includes all the information needed for the trading operation
            const tradingContext = `
User Request: ${message.content.text}

TASK: Analyze this trading request and provide a safe implementation plan.
1. Interpret the user's trading intention
2. Verify market conditions and availability
3. Assess risk levels and appropriate position sizing
4. Provide step-by-step execution plan with safety checks
5. Include warnings about potential risks

Please format your response as follows:
1. Trade Analysis: [Brief analysis of what the user wants to do]
2. Market Conditions: [Current relevant market conditions]
3. Risk Assessment: [Analysis of the risks involved]
4. Execution Plan: [Step-by-step plan to execute the trade safely]
5. Recommendations: [Additional safety recommendations]
`;

            // Use the specialized trading text generator
            const analysisResponse = await generateTradingText({
                runtime,
                context: tradingContext,
                modelClass: ModelClass.LARGE, // Use a larger model for better analysis
            });

            // Provide the analysis to the user
            if (callback) {
                await callback({
                    text: analysisResponse
                });
            }

            // Note: In a real implementation, you would now handle the actual trade execution
            // based on user confirmation and the analysis provided

            elizaLogger.info("Trade analysis completed successfully", {
                userId: userId as string,
                roomId: roomId as string,
                requestType: "trade"
            });

        } catch (error) {
            elizaLogger.error("Error in trade action:", error);

            if (callback) {
                await callback({
                    text: "I encountered an error while processing your trading request. For your safety, no trade was executed. Please try again with more specific details."
                });
            }
        }
    }
};