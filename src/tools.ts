import { tool } from '@langchain/core/tools';
import { ApifyClient } from 'apify-client';
import { z } from 'zod';
import log from '@apify/log';

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

const FetchBookingListingsTool = tool(
  async (input) => {
    log.info('in fetch_booking_listings');
    log.info(JSON.stringify(input));
    
    try {      
      const run = await client.actor('oeiQgfg5fsmIJB7Cn').call({
        currency: "USD",
        language: "en-us",
        maxItems: 10,
        minMaxPrice: input?.minMaxPrice ?? "0-999999",
        search: input?.cityName ?? "New York",
        rooms: input?.numberOfRooms ?? 1,
        adults: input?.numberOfAdults ?? 1,
        children: input?.numberOfChildren ?? 0,
        sortBy: "distance_from_search",
        starsCountFilter: input?.starsCountFilter ?? "any"
      }, { memory: 2048 });
      
      const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
      log.info(`Found ${listings.length} Booking.com listings.`);
      return JSON.stringify({ listings: listings.slice(0,5) });
    } catch (err) {
      log.error('Booking.com error: ' + (err as Error).message);
      return JSON.stringify([]);
    }
  }, 
  {
    name: 'fetch_booking_listings',
    description: 'Fetch Booking.com listings.',
    schema: z.object({
      cityName: z.string().describe("The city to search for Booking.com listings in"),
      numberOfRooms: z.number().describe("Number of rooms to search for"),
      numberOfAdults: z.number().describe("Number of adults to search for"),
      numberOfChildren: z.number().describe("Number of children to search for"),
      minMaxPrice: z.string().describe("Price range in format 'min-max' (e.g., '0-999999')"),
      starsCountFilter: z.enum(["any", "1", "2", "3", "4", "5", "unrated"]).describe("Hotel star rating filter")
    })
  }
);

const FetchAirbnbListingsTool = tool(
  async (input) => {
    log.info('in fetch_airbnb_listings')
    log.info(JSON.stringify(input));
    try {
        if (typeof input === 'string') {
          try { 
            input = JSON.parse(input);
          } catch (e) { throw new Error('Input string is not valid JSON'); }
        }

        const run = await client.actor('GsNzxEKzE2vQ5d9HN').call({
          locationQueries: [
            input?.cityName ?? "New York"
          ],
          locale: "en-US",
          currency: "USD",
          checkIn: input?.checkIn ?? new Date().toISOString().split('T')[0],
          checkOut: input?.checkOut ?? new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          numberOfAdults: input?.numberOfAdults ?? 1,
          numberOfChildren: input?.numberOfChildren ?? 0,
          priceMax: input?.priceMax ?? 300,
          minBeds: input?.minBeds ?? 1,
          minBedrooms: input?.minBedrooms ?? 1,
          minBathrooms: input?.minBathrooms ?? 1,
          numberOfPets: input?.numberOfPets ?? 0,
        }, { maxItems: 10, memory: 2048 });
        const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
        
        log.info(`Found ${listings.length} Airbnb listings.`);
        return JSON.stringify({ listings: listings.slice(0,5) });
    } catch (err: any) {
        log.error('Airbnb error: ' + err.message);
        return JSON.stringify([]);
    }
  }, {
    name: 'fetch_airbnb_listings',
    description: 'Fetch Airbnb listings.',
    schema: z.object({
      cityName: z.string().describe("The city to search for Airbnb listings in"),
      checkIn: z.string().describe("Check-in date in YYYY-MM-DD format"),
      checkOut: z.string().describe("Check-out date in YYYY-MM-DD format"),
      numberOfRooms: z.number().describe("Number of rooms to search for"),
      numberOfAdults: z.number().describe("Number of adults to search for"),
      numberOfChildren: z.number().describe("Number of children to search for"),
      priceMax: z.number().describe("Maximum price to search for"),
      minBeds: z.number().describe("Minimum number of beds to search for"),
      minBedrooms: z.number().describe("Minimum number of bedrooms to search for"),
      minBathrooms: z.number().describe("Minimum number of bathrooms to search for"),
      numberOfPets: z.number().describe("Number of pets to search for")
    })
  }
)

const FetchFlightsTool = tool(
  async (input) => {
    log.info('in fetch_flights');
    log.info(JSON.stringify(input));
    
    try {      
      const run = await client.actor('tiveIS4hgXOMtu3Hf').call({
        market: "US",
        currency: "USD",
        "origin.0": input?.departureCity ?? "Toronto",
        "target.0": input?.arrivalCity ?? "New York",
        "depart.0": input?.departDate ?? new Date().toISOString().split('T')[0]
      }, { maxItems: 20, memory: 2048 });
      
      const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
      log.info(`Found ${listings.length} flights.`);
      return JSON.stringify({ listings: listings.slice(0,5) });
    } catch (err) {
      log.error('SkyScanner error: ' + (err as Error).message);
      return JSON.stringify([]);
    }
  }, 
  {
    name: 'fetch_flights',
    description: 'Fetch flight listings.',
    schema: z.object({
      departureCity: z.string().describe("The city to depart from"),
      arrivalCity: z.string().describe("The city to arrive at"),
      departDate: z.string().describe("Departure date in YYYY-MM-DD format"),
      arrivalDate: z.string().describe("Return date in YYYY-MM-DD format")
    })
  }
);

export const agentTools = [
  FetchAirbnbListingsTool,
  FetchBookingListingsTool,
  FetchFlightsTool
];