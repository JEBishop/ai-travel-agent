import { Tool } from '@langchain/core/tools';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

class FetchBookingListingsTool extends Tool {
    name = 'fetch_booking_listings';
  description = 'Fetch Booking.com listings.'
  async _call(arg: string) {
    console.log('in fetch_booking_listings')
    console.log(arg)
    var input;
    try {
        if (typeof arg === 'string') {
          try { 
            input = JSON.parse(arg);
          } catch (e) { throw new Error('Input string is not valid JSON'); }
        }

        console.log(input);

        console.log({
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
        })

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
        });
        const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
        
        console.log(`Found ${listings.length} Booking.com listings.`);
        return JSON.stringify({ listings: listings.slice(0,5) });
    } catch (err: any) {
        console.log('Booking.com error: ' + err.message);
        return JSON.stringify([]);
    }
  }
}

class FetchAirbnbListingsTool extends Tool {
  name = 'fetch_airbnb_listings';
  description = 'Fetch Airbnb listings.'
  async _call(arg: string) {
    console.log('in fetch_airbnb_listings')
    console.log(arg)
    var input;
    try {
        if (typeof arg === 'string') {
          try { 
            input = JSON.parse(arg);
          } catch (e) { throw new Error('Input string is not valid JSON'); }
        }

        console.log(input);

        console.log({
          locationQueries: [
            input?.cityName ?? "New York"
          ],
          locale: "en-US",
          currency: "USD",
          checkIn: input?.checkIn ?? new Date().toLocaleString(),
          checkOut: input?.checkOut ?? ((new Date()).getDate() + 5).toLocaleString(),
          numberOfAdults: input?.adults ?? 1,
          numberOfChildren: input?.children ?? 0,
          priceMax: input?.priceMax ?? 300,
          minBeds: input?.minBeds ?? 1,
          minBedrooms: input?.minBedrooms ?? 1,
          minBathrooms: input?.minBathrooms ?? 1,
          numberOfPets: input?.pets ?? 0,
        })

        const run = await client.actor('GsNzxEKzE2vQ5d9HN').call({
          locationQueries: [
            input?.cityName ?? "New York"
          ],
          locale: "en-US",
          currency: "USD",
          checkIn: input?.checkIn ?? new Date().toLocaleString(),
          checkOut: input?.checkOut ?? ((new Date()).getDate() + 5).toLocaleString(),
          numberOfAdults: input?.adults ?? 1,
          numberOfChildren: input?.children ?? 0,
          priceMax: input?.priceMax ?? 300,
          minBeds: input?.minBeds ?? 1,
          minBedrooms: input?.minBedrooms ?? 1,
          minBathrooms: input?.minBathrooms ?? 1,
          numberOfPets: input?.pets ?? 0,
        });
        const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
        
        console.log(`Found ${listings.length} Airbnb listings.`);
        return JSON.stringify({ listings: listings.slice(0,5) });
    } catch (err: any) {
        console.log('Airbnb error: ' + err.message);
        return JSON.stringify([]);
    }
  }
}

class FetchFlightsTool extends Tool {
  name = 'fetch_flights';
description = 'Fetch flight listings.'
async _call(arg: string) {
  console.log('in fetch_flights')
  console.log(arg)
  var input;
  try {
      if (typeof arg === 'string') {
        try { 
          input = JSON.parse(arg);
        } catch (e) { throw new Error('Input string is not valid JSON'); }
      }

      console.log(input);

      console.log({
        market: "US",
        currency: "USD",
        "origin.0": input?.departureCity ?? "Toronto",
        "target.0": input?.arrivalCity ?? "New York",
        "depart.0": input?.departDate ?? new Date().toLocaleString()
      })

      const run = await client.actor('tiveIS4hgXOMtu3Hf').call({
        market: "US",
        currency: "USD",
        "origin.0": input?.departureCity ?? "Toronto",
        "target.0": input?.arrivalCity ?? "New York"
      }, { maxItems: 20});
      const { items: listings } = await client.dataset(run.defaultDatasetId).listItems();
      
      console.log(`Found ${listings.length} flights.`);
      return JSON.stringify({ listings: listings.slice(0,5) });
  } catch (err: any) {
      console.log('SkyScanner error: ' + err.message);
      return JSON.stringify([]);
  }
}
}

export const agentTools = [
  new FetchBookingListingsTool(),
  new FetchAirbnbListingsTool(),
  new FetchFlightsTool()
];