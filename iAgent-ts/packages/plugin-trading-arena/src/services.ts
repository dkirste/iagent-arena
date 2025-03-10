import {
    agentToken,
} from "./types";

const BASE_URL = "https://api.nasa.gov/planetary/apod\?api_key\=";

export const createiAgentService = (agentAddress: string) => {
    const createNewAgentToken = async (): Promise<agentToken> => {
        if (!agentAddress) {
            throw new Error("Invalid parameters");
        }
        const t: agentToken = {
            copyright: "Test",
            date: "TestDate",
            explanation: "Test",
            hdurl: "Test",
            media_type: "",
            service_version: "",
            title: "",
            url: ""
        };
        try {
            // Call Injective Plugin

            return t;
        } catch (error: any) {
            console.error("Could not create new token:", error.message);
            throw error;
        }
    };

    return {createNewAgentToken}
};
