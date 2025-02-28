
import { IAgentRuntime, ModelClass } from "./types";
import { generateText } from "./generation.ts";
import { elizaLogger } from "./logger.ts";

/**
 * Options for generating trading-focused text responses
 */
export interface TradingTextOptions {
    runtime: IAgentRuntime;
    context: string;
    modelClass?: ModelClass;
    customTradingPrompt?: string;
    maxSteps?: number;
    stop?: string[];
}

/**
 * Generate text responses optimized for trading and financial operations
 * This uses a specialized system prompt that emphasizes safety, risk management,
 * and proper handling of financial operations
 *
 * @param options Configuration options for the text generation
 * @returns Generated text with trading-specific guidance
 */
export async function generateTradingText(options: TradingTextOptions): Promise<string> {
    const {
        runtime,
        context,
        modelClass = ModelClass.LARGE, // Use a larger model by default for trading
        customTradingPrompt,
        maxSteps = 1,
        stop
    } = options;

    try {
        elizaLogger.info("Generating trading-focused text response");

        const response = await generateText({
            runtime,
            context,
            modelClass,
            maxSteps,
            stop,
            customSystemPrompt: customTradingPrompt, // Use custom if provided
            useTradingPrompt: true, // Enable trading-specific system prompt
        });

        return response;
    } catch (error) {
        elizaLogger.error("Error generating trading text:", error);
        throw error;
    }
}

/**
 * Enhanced trading prompt that combines the base trading prompt with
 * additional context-specific instructions
 *
 * @param basePrompt The base trading system prompt
 * @param additionalInstructions Additional domain-specific instructions
 * @returns Combined system prompt
 */
export function enhanceTradingPrompt(basePrompt: string, additionalInstructions: string): string {
    return `${basePrompt}\n\nADDITIONAL INSTRUCTIONS:\n${additionalInstructions}`;
}