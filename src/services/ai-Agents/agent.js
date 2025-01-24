import { DynamicTool } from "@langchain/core/tools";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { AgentExecutor } from "langchain/agents";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: false,
    streaming: true,
  });

export const agent = async (input) => {
    try {
        const searchContents = async () => {
            try {
                const result = await searchContents(input)
                return JSON.stringify(result)
            } catch (error) {
                console.log("error retriveing the data form chroma db", error);

            }
        }

        const tools = [
            new DynamicTool({
                name: "search_contents",
                description: `You can ask any questions by calling the tool function `,
                func: searchContents
            }),
        ];
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `
             You are an AI assistant to answer the user's question.Answer the user question ,if the tool output includes a relevent answer about the question.

            // we can adjust the prompt , how we want
        `,
            ],

            ["human", "{input}"],
            new MessagesPlaceholder("agent_scratchpad"),
        ]);

        const modelWithFunctions = model.bind({
            functions: tools.map((tool) => convertToOpenAIFunction(tool)),
        });

        const agentWithMemory = RunnableSequence.from([
            {
                input: (i) => i.input,
                output: (i) => i.output,
                agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
                chat_history: (i) => i.chat_history,
                format: (i) => i.format,
            },
            prompt,
            modelWithFunctions,
            new OpenAIFunctionsAgentOutputParser(),
        ]);
        const executor = AgentExecutor.fromAgentAndTools({
            agent: agentWithMemory,
            tools,
            verbose: false,
            maxIterations: 3,
        });


        // If we have the hiostory of any chat messages we can set the agent response based on the context

        const result = await executor.invoke({
            input,
        });
        return result
    } catch (error) {
        console.log(error);
    }
};

