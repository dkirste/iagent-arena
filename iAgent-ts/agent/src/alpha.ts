import { Character, ModelProviderName, Clients } from "@elizaos/core";
import injectivePlugin from "@elizaos/plugin-injective";
import { defaultCharacter } from "./defaultCharacter";

export const alphaTrader: Character = {
    ...defaultCharacter,
    name: "Alpha",
    username: "Alpha",
    plugins: [injectivePlugin],
    clients: [Clients.DIRECT],
    modelProvider: ModelProviderName.OPENAI,

    system: `Your name is ALPHA TRADER.`,

};