const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

// Explicitly set CORS headers for preflight requests (OPTIONS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://cameron.prowingz.com"); // Allow only your frontend
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allowed methods
  res.header("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
  if (req.method === "OPTIONS") {
    return res.status(200).send(); // Preflight response
  }
  next();
});

// Parse JSON bodies
app.use(bodyParser.json());

// Replace with your Meta Pixel ID and Access Token
const PIXEL_ID = "592807929789990";
const ACCESS_TOKEN =
  "EAAhaFaSOtjsBO5SrVn5PX3mG7jbguZAas0gY9RM3RBAezDuj8glgPtAjIRygicZCmboqEVFpXHVICtRsKVZCkuTjya8aU1E1g2DPpLcVfWqMNtf1rxlDt1PnZBoKOyf0rmoCvInwNZAXQtXNlAH7ib61sWX73382iy4cWaFKJJZC051eOsMbn4sQ5MTcDBp2TXkwZDZD";

// Function to send events to Meta
// Function to send events to Meta
const crypto = require('crypto');

// Function to hash the input string using SHA-256
function hashString(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Function to send events to Meta
async function sendToMeta(eventName, eventData) {
  console.log("sendToMeta trigger");

  const hashedEmail = hashString("testuser@example.com"); // Replace with the actual email
  const hashedPhone = hashString("1234567890"); // Replace with the actual phone number

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${PIXEL_ID}/events`,
      {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: eventData.url, // Add event source URL
            user_data: {
              client_user_agent: eventData.userAgent, // Client user agent (navigator.userAgent)
              em: [hashedEmail],  // Hashed email
              ph: [hashedPhone],  // Hashed phone number
            },
            custom_data: eventData.customData,
          },
        ],
        access_token: ACCESS_TOKEN,
      }
    );
    console.log("Event sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending event to Meta:",
      error.response?.data || error.message
    );
  }
}


// API endpoint to receive events from your website
app.post("/track-event1", (req, res) => {
  console.log("Request body:", req.body);
  const { eventName, eventData } = req.body;

  // Call function to send event to Meta
  sendToMeta(eventName, eventData);

  // Respond to the frontend
  res.status(200).send({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));