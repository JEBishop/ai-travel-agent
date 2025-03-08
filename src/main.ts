import { Actor } from 'apify';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, MessageContentComplex } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { Input } from './types.js'
import { agentTools } from './tools.js'

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
  tools: agentTools
});

try {
  const finalState = await agent.invoke(
    {
      messages: [
        new HumanMessage(`
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
              !IMPORTANT! -> All data sent to tools should be passed as a **JSON object**.
              !IMPORTANT! -> You MUST call each of these three tools separately with the data in each request:
              FIRST: Retrieve flight options using the fetch_flights tool:
                - fetch_flights → Pass a properly formatted JSON object. Do not pass a plain text string.
                  \`\`\`json
                  {
                    "departureCity": "string",
                    "arrivalCity": "string",
                    "departDate": "string (format -> 'YYYY-MM-DD')"
                    "arrivalDate": "string (format -> 'YYYY-MM-DD')"
                  }
                  \`\`\`
              SECOND: Retrieve accommodation options using the following tools (fetch_booking_listings and fetch_airbnb_listings):
                - fetch_booking_listings → Pass a properly formatted JSON object. Do not pass a plain text string.
                  \`\`\`json
                  {
                    "cityName": "string"
                    "numberOfRooms", "number"
                    "numberOfAdults", "number"
                    "numberOfChildren": "number"
                    "minMaxPrice": "string (format -> min-max)", 
                    "starsCountFilter": "string (enum -> "any", "1", "2", "3", "4", "5", "unrated")",
                  }
                  \`\`\`
                - fetch_airbnb_listings → Pass a properly formatted JSON object. Do not pass a plain text string.
                  \`\`\`json
                  {
                    "cityName": "string",
                    "checkIn": "string (format -> 'YYYY-MM-DD')",
                    "checkOut": "string (format -> 'YYYY-MM-DD')",
                    "numberOfRooms": "number",
                    "numberOfAdults": "number",
                    "numberOfChildren": "number",
                    "priceMax": "number",
                    "minBeds": "number",
                    "minBedrooms": "number",
                    "minBathrooms": "number",
                    "numberOfPets": "number"
                  }
                  \`\`\`


          STEP 3: Filter and Rank Results:
              Apply user-defined filters (e.g., minimum rating, price range, specific amenities).

          STEP 4: Generate and Format Output:
              - Present a JSON structured array of the best-matching accommodations and flights.
              - Include key details such as:
                  For accommodations: property name, location, rating, price per night, and booking link.
                  For flights: airline, departure/arrival times, duration, layovers, and booking link.
              - Ensure clarity by formatting results in a table or list, making them easy to compare.
        `)
      ]
    }, {
      recursionLimit: 10
    }
  );

  var content = finalState.messages[finalState.messages.length - 1].content;
  /**
   * Some GPT models will wrap the output array in an object, despite response formatting and strict prompting.
   * Ex: { "results": [<< our data array >>] }
   * Need to handle these edge cases gracefully in order to guarantee consistent output for users.
   */
  if (typeof content === 'string') {
    try {
      const parsedContent = JSON.parse(content) as MessageContentComplex[];
      if (typeof parsedContent === 'object' && parsedContent !== null && !Array.isArray(parsedContent)) {
        const possibleKeys = ['input', 'output', 'result', 'results', 'response', 'listings', 'homes', 'rentals', 'houses', 'filteredListings', 'filteredHomes', 'filteredRentals', 'filteredHouses'];
        
        const matchingKey = possibleKeys.find(key => key in parsedContent as any);
        
        if (matchingKey) {
          content = (parsedContent as any)[matchingKey];
        } else {
          content = parsedContent;
        }
      } else {
        content = parsedContent; 
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  }
  const output = Array.isArray(content) ? content: [content];

  console.log(output)

  await Actor.charge({ eventName: 'listings-output', count: output.length });

  await Actor.pushData(output);
} catch (e: any) {
  console.log(e);
  await Actor.pushData({ error: e.message });
}
await Actor.exit();