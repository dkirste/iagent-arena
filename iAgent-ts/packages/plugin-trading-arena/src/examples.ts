import { ActionExample } from "@elizaos/core";

export const getTradeTokenExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Buy the token",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will buy my own token with my fiat reserve",
                action: "TRADE_TOKEN",
            },
        }
    ],
]

export const createTokenExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Initialization",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will initially create my token",
                action: "CREATE_TOKEN",
            },
        }
    ],

];