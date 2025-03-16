import { Output } from './types.js';

export const formatHtml = (itinerary: Output) => {
    return `<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Itinerary</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
                color: #333;
            }
            h1, h2 {
                color: #222;
            }
            .section {
                margin-bottom: 30px;
            }
            .flight-details, .hotel-details {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
            }
            .flight-details strong, .hotel-details strong {
                color: #444;
            }
            .hotel-container {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 10px;
            }
            .hotel-container img {
                width: 180px;
                height: auto;
                border-radius: 8px;
            }
            .hotel-info {
                flex: 1;
            }
            .link {
                display: inline-block;
                margin-top: 5px;
                color: #0073e6;
                text-decoration: none;
                font-weight: bold;
            }
            .link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
    
        <h1>Itinerary</h1>
    
        <h2>Flights</h2>
        ${itinerary.flights.map((flight, index) => `
            <div class='flight-details'>
                <h3>Flight ${index + 1} - ${flight.price.formatted}</h3>
                ${flight.legs.map(leg => `
                    <p>${leg.origin.name} (${leg.origin.displayCode}) → ${leg.destination.name} (${leg.destination.displayCode})</p>
                    <p>Departure: ${new Date(leg.departure).toLocaleString()}</p>
                    <p>Arrival: ${new Date(leg.arrival).toLocaleString()}</p>
                    <p>Stops: ${leg.stopCount}</p>
                `).join('')}
            </div>
        `).join('')}
    
        <h2>Accommodations</h2>
        ${itinerary.accomodations.map(acc => acc.source === 'booking' ? `
            <div class='hotel-details'>
                <h3>${acc.name} (${acc.type})</h3>
                <p>Rating: ${acc.rating} (${acc.reviews} reviews)</p>
                <p>${acc.description}</p>
                <a class='link' href='${acc.link}' target='_blank'>More info</a>
                <div class='hotel-container'>
                    <img src='${acc.image}' alt='Hotel image'>
                </div>
            </div>
        ` : '').join('')}
    
        <h2>Attractions</h2>
        ${itinerary.attractions.map(attraction => `
            <div class='section'>
                <h3>${attraction.title}</h3>
                <p>${attraction.description}</p>
                <a class='link' href='${attraction.link}' target='_blank'>More info</a>
            </div>
        `).join('')}
    
    </body>
    </html>`.replace(/\s+/g, ' ').trim();
}


export const formatMarkdown = (itinerary: Output) => {
    return `# Itinerary
    
    ## Flights
    ${itinerary.flights.map((flight, index) => `        
        ### Flight ${index + 1} - ${flight.price.formatted}
        ${flight.legs.map(leg => `
            - **${leg.origin.name} (${leg.origin.displayCode}) → ${leg.destination.name} (${leg.destination.displayCode})**
              - Departure: ${new Date(leg.departure).toLocaleString()}
              - Arrival: ${new Date(leg.arrival).toLocaleString()}
              - Stops: ${leg.stopCount}
        `).join('')}
    `).join('')}
    
    ## Accommodations
    ${itinerary.accomodations.map(acc => acc.source === 'booking' ? `
        ### ${acc.name} (${acc.type})\n
        **Rating:** ${acc.rating} (${acc.reviews} reviews)\n
        ${acc.description}\n
        [More info](${acc.link})\n
        ![Image](${acc.image})\n
        ` : '').join('')
    };
    
    ## Attractions
        ${itinerary.attractions.map(attraction => `
        ### ${attraction.title}
        - ${attraction.description}
        - [More info](${attraction.link})
    `).join('')}
    `
}
