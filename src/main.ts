import { Actor } from 'apify';
import log from '@apify/log';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { Input, Output } from './types.js'
import { responseSchema } from './types.js'
import { agentTools } from './tools.js'
import { setContextVariable } from "@langchain/core/context";
import { RunnableLambda } from "@langchain/core/runnables";

await Actor.init();

const input = await Actor.getInput<Input>();
if (!input) throw new Error('No input provided.');

await Actor.charge({ eventName: 'init' });

const { OPENAI_API_KEY, travelRequest } = input;

let llmAPIKey;
if(!OPENAI_API_KEY || OPENAI_API_KEY.length == 0) {
  llmAPIKey = process.env.OPENAI_API_KEY;
  await Actor.charge({ eventName: 'llm-input', count: travelRequest.length });
} else {
  llmAPIKey = OPENAI_API_KEY;
}

const agentModel = new ChatOpenAI({ 
  apiKey: llmAPIKey,
  modelName: "gpt-4o-mini",  
}).bind({
  response_format: { type: "json_object" },
  tools: agentTools
});

const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  responseFormat: responseSchema
});

try {
  const handleRunTimeRequestRunnable = RunnableLambda.from(
    async ({ travelRequest: travelRequest }) => {
      setContextVariable("travelRequest", travelRequest);
      const modelResponse = await agent.invoke({
        messages: [new HumanMessage(`
          You are an expert travel agent. You are tasked with helping a client sort out their travel plans.
          The current date is ${(new Date()).toLocaleDateString()}

          STEP 1: Understand User Requirements:
            - Extract key details from the user’s input (${travelRequest}), including:
              - Accommodation preferences (e.g., location, number of rooms, ratings, price range, amenities).
              - Flight details (e.g., departure and destination cities, dates, airlines, budget, preferred stops).
              - !IMPORTANT! - If a user does not explicitly mention a city, use your general knowledge to deduce a popular city that they would be looking for.
              - Example: If a user says Northern Italy, they probably mean Milan.
              - If a user does not mention where their departure city, assume New York

          STEP 2: Gather Travel Data:
              FIRST: Retrieve flight options using the fetch_flights tool.
              SECOND: Retrieve accommodation options using fetch_booking_listings fetch_airbnb_listings

          STEP 3: Filter and Rank Results:
              Apply user-defined filters (e.g., minimum rating, price range, specific amenities).

          STEP 4: Generate and Format Output:
              - Present a JSON structured array of the best-matching accommodations and flights.
              - Include key details such as:
                  For accommodations: property name, location, rating, price per night, and booking link.
                  For flights: airline, departure/arrival times, duration, layovers, and booking link.
              - Ensure clarity by formatting results in a table or list, making them easy to compare.
        `)]
      }, {
        recursionLimit: 10
      });
      return modelResponse.structuredResponse as Output;
    }
  );

  const output: Output = await handleRunTimeRequestRunnable.invoke({ travelRequest: travelRequest });

  log.info(JSON.stringify(output));

  await Actor.charge({ eventName: 'listings-output', count: (output.accomodations.length + output.flights.length) });

  await Actor.pushData(output);
} catch (err: any) {
  log.error(err.message);
  await Actor.pushData({ error: err.message });
}
await Actor.exit();