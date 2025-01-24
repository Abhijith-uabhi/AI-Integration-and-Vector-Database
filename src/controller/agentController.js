import { agent } from "../services/ai-Agents/agent.js";

export const agentAutoResponse = async (req, res) => {
    try {
        const { input } = req.query
        //call agent for getting response
        const response = await agent(input)

        res.status(200).json({ response })
    } catch (error) {
        res.status(500).json({ error: "Failed to get agent response", details: error.message });

    }
}