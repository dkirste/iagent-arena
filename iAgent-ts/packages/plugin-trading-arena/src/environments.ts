import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const iagentEnvSchema = z.object({
    AGENT_ADDRESS: z.string().min(1, "AgentAddress"),
});

export type nasaConfig = z.infer<typeof iagentEnvSchema>;

export async function validateiAgentConfig(
    runtime: IAgentRuntime
): Promise<nasaConfig> {
    try {
        const config = {
            AGENT_ADDRESS: runtime.getSetting("AGENT_ADDRESS"),
        };
        console.log('config: ', config)
        return iagentEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Could not get the agents address:\n${errorMessages}`
            );
        }
        throw error;
    }
}