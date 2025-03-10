import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { validateiAgentConfig } from "../environments";
import { createTokenExamples } from "../examples";
import { createiAgentService } from "../services";
import injectivePlugin from "@elizaos/plugin-injective";


export const createTokenAction: Action = {
    name: "CREATE_TOKEN",
    similes: [
        "MARS",
        "MARTIAN",
        "MARS PHOTO"
    ],
    description: "Create the agents own token",
    validate: async (runtime: IAgentRuntime) => {
        await validateiAgentConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateiAgentConfig(runtime);
        const iAgentService = createiAgentService(
            config.AGENT_ADDRESS
        );

        try {
            const iagent_token = await iAgentService.createNewAgentToken();
            const injectiveService = inj
            _ = await injectivePlugin.actions[0].handler(runtime, message, state, _options, callback);
            elizaLogger.success(
                `Successfully created new token for agent: ${config.AGENT_ADDRESS}`
            );
            if (callback) {
                callback({
                    text: `Successfully created the new token for the agent: ${config.AGENT_ADDRESS}. Token details: ${JSON.stringify(iagent_token, null, 2)}`
                });
                return true;
            }
        } catch (error:any) {
            elizaLogger.error("Error in iAgent Arena plugin handler:", error);
            callback({
                text: `Error creating the new token: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: createTokenExamples as ActionExample[][],
} as Action;