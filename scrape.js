const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs"); // Import the file system module

const url = "https://b2bpurchase.com/events-calendar/";

axios.get(url)
  .then((response) => {
    let $ = cheerio.load(response.data);
    
    // Initialize an array to store event data
    let events = [];
    
    // Iterate over each event element
    $('div.itm-ev-event-desc-cont').each(function(index, element){
        // Extract different attributes
        let eventName = $(this).find('h4').text().trim();
        let eventDateTime = $(this).find('.itm-ev-p').eq(0).text().trim(); // Assuming date and time are in the first element with class "itm-ev-p"
        let eventLocation = $(this).find('.itm-ev-p').eq(1).text().trim(); // Assuming location is in the second element with class "itm-ev-p"
        
        // Create an object with the extracted attributes
        let eventData = {
            name: eventName,
            dateTime: eventDateTime,
            location: eventLocation
        };
        
        // Push the object into the events array
        events.push(eventData);
    });
    
    // Output the array of event data
    console.log(events);

    // Convert the array to JSON
    const jsonData = JSON.stringify(events, null, 2);

    // Write JSON to file
    fs.writeFile('event.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
        return;
      }
      console.log('Event data has been written to events.json');
    });
  })
  .catch((error) => {
    console.log("Error fetching or parsing data:", error);
  });
