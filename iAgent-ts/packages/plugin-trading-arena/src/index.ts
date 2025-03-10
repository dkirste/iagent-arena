import { Plugin } from "@elizaos/core";
//import { createLiquidityPool } from "./actions/createLiquidityPool";
import { createTokenAction } from "./actions/createToken";
// import { tradeToken } from "./actions/tradeToken";

export const nasaPlugin: Plugin = {
    name: "iAgentArena",
    description: "iAgentArena plugin for ElizaOS",
    actions: [createTokenAction],
    // actions: [createLiquidityPool, createTokenAction, tradeToken],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default nasaPlugin;