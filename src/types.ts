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
        additionalProperties: { type: "string" }
      }
    }
  },
  required: []
};

export interface Input {
  travelRequest: string;
  OPENAI_API_KEY: string;
}