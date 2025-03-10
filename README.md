# AI Travel Agent - Apify Actor

## Overview
The **AI Travel Agent** is an Apify Actor that helps users plan their trips effortlessly by leveraging OpenAI's GPT-based capabilities. Simply provide your travel request, and the AI will generate structured recommendations, including flights and accommodations, to suit your needs.

## How It Works
- The actor processes your **travel request** using an agentic AI approach.
- It searches for flights and accommodations based on your input.
- It returns structured JSON results, including flight details, hotel options, and Airbnb listings.
- If you provide your own OpenAI API key, you won't be charged for LLM usage.

## Sample Input
```json
{
    "travelRequest": "Find me a round-trip flight to Tokyo and a hotel near Shibuya for April 15-22.",
    "OPENAI_API_KEY": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Sample Output
```json
[
    {
        "flights": [
            {
                "airline": "Japan Airlines",
                "departure_time": "2025-04-15T10:30:00",
                "arrival_time": "2025-04-16T14:15:00",
                "duration": "12 hours 45 minutes",
                "layovers": "0",
                "price": 920.50,
                "booking_link": "https://flights.example.com/book?flight=12345"
            }
        ],
        "accommodations": {
            "booking": [
                {
                    "property_name": "Shibuya Excel Hotel Tokyu",
                    "location": "Shibuya, Tokyo",
                    "rating": 4.5,
                    "price_per_night": 200,
                    "booking_link": "https://www.booking.com/hotel/jp/shibuya-excel.html"
                }
            ],
            "airbnb": [
                {
                    "property_name": "Modern Studio near Shibuya Station",
                    "location": "Shibuya, Tokyo",
                    "price_per_night": 150,
                    "booking_link": "https://www.airbnb.com/rooms/56789012"
                }
            ]
        }
    }
]
```

## Features
✅ **Agentic AI Planning:** Generates structured travel itineraries with flights and accommodations.
✅ **Multi-Source Recommendations:** Provides booking links from airlines, hotels, and Airbnb.
✅ **User-Powered OpenAI API Key:** If you provide your key, you won't be charged for LLM usage.
✅ **Supports English Queries:** The AI processes travel requests in English and returns structured JSON results.

## Usage Instructions
1. Deploy the actor on Apify.
2. Input your travel request in **natural language**.
3. Optionally, provide your **OpenAI API Key** to avoid LLM usage charges.
4. Run the actor and receive structured travel recommendations.
5. Use the provided booking links to finalize your trip!

## Notes
- Ensure your **travel request** is in English for optimal AI performance.
- Results are structured and formatted for easy parsing and use in automation workflows.
- The actor does not handle direct bookings; it only provides recommendations.

## Contact
For support or feature requests, visit the [Apify Marketplace](https://apify.com) or open an issue on the project repository.

