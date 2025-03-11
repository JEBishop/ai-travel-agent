export const responseSchema = {
  type: "object",
  properties: {
    accomodations: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "object",
            properties: {
              source: { type: "string", enum: ["booking"] },
              name: { type: "string" },
              type: { type: "string", enum: ["hotel"] },
              rating: { type: "number" },
              reviews: { type: "number" },
              description: { type: "string" },
              price: { type: "number" },
              link: { type: "string" },
              image: { type: "string" }
            },
            required: ["source", "name", "type", "rating", "reviews", "description", "price", "link", "image"]
          },
          {
            type: "object",
            properties: {
              source: { type: "string", enum: ["airbnb"] },
              thumbnail: { type: "string" },
              url: { type: "string" },
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              rating: {
                type: "object",
                properties: {
                  accuracy: { type: "number" },
                  checking: { type: "number" },
                  cleanliness: { type: "number" },
                  communication: { type: "number" },
                  location: { type: "number" },
                  value: { type: "number" },
                  guestSatisfaction: { type: "number" },
                  reviewsCount: { type: "number" }
                },
                required: ["accuracy", "checking", "cleanliness", "communication", "location", "value", "guestSatisfaction", "reviewsCount"]
              }
            },
            required: ["source", "thumbnail", "id", "title", "description", "rating"]
          }
        ]
      }
    },
    flights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          price: {
            type: "object",
            properties: {
              raw: { type: "number" },
              formatted: { type: "string" },
              pricingOptionId: { type: "string" }
            },
            required: ["raw", "formatted", "pricingOptionId"]
          },
          legs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                origin: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    entityId: { type: "string" },
                    name: { type: "string" },
                    displayCode: { type: "string" },
                    city: { type: "string" },
                    country: { type: "string" },
                    isHighlighted: { type: "boolean" }
                  },
                  required: ["id", "entityId", "name", "displayCode", "city", "country", "isHighlighted"]
                },
                destination: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    entityId: { type: "string" },
                    name: { type: "string" },
                    displayCode: { type: "string" },
                    city: { type: "string" },
                    country: { type: "string" },
                    isHighlighted: { type: "boolean" }
                  },
                  required: ["id", "entityId", "name", "displayCode", "city", "country", "isHighlighted"]
                },
                durationInMinutes: { type: "integer" },
                stopCount: { type: "integer" },
                isSmallestStops: { type: "boolean" },
                departure: { type: "string", format: "date-time" },
                arrival: { type: "string", format: "date-time" },
                timeDeltaInDays: { type: "integer" },
                carriers: {}, // any type as requested
                segments: {} // any type as requested
              },
              required: [
                "origin", "destination", "durationInMinutes", "stopCount",
                "isSmallestStops", "departure", "arrival", "timeDeltaInDays",
                "carriers", "segments"
              ]
            }
          }
        },
        required: ["price", "legs"]
      }
    },
    attractions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          link: { type: "string" },
          description: { type: "string" }
        },
        required: ["title", "link", "description"]
      }
    }
  },
  required: ["accomodations", "flights", "attractions"]
};

interface BookingHotel {
  source: "booking";
  name: string;
  type: "hotel";
  rating: number;
  reviews: number;
  description: string;
  price: number;
  link: string;
  image: string;
}

interface Attraction {
  title: string;
  link: string;
  description: string;
}

interface AirbnbRating {
  accuracy: number;
  checking: number;
  cleanliness: number;
  communication: number;
  location: number;
  value: number;
  guestSatisfaction: number;
  reviewsCount: number;
}

interface AirbnbProperty {
  source: "airbnb";
  thumbnail: string;
  url: string;
  id: string;
  title: string;
  description: string;
  rating: AirbnbRating;
}

type Accommodation = BookingHotel | AirbnbProperty;

interface Price {
  raw: number;
  formatted: string;
  pricingOptionId: string;
}

interface Location {
  id: string;
  entityId: string;
  name: string;
  displayCode: string;
  city: string;
  country: string;
  isHighlighted: boolean;
}

interface Leg {
  origin: Location;
  destination: Location;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string; // ISO date-time format
  arrival: string; // ISO date-time format
  timeDeltaInDays: number;
  carriers: any; // any type as requested
  segments: any; // any type as requested
}

interface FlightData {
  price: Price;
  legs: Leg[];
}

export interface Output {
  accomodations: Accommodation[];
  flights: FlightData[];
  attractions: Attraction[];
};

export interface Input {
  travelRequest: string;
  OPENAI_API_KEY: string;
}
