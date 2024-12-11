const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto");

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
  "EAAhaFaSOtjsBO8vmYbA78SPgj3KPmlL0WRYDFpUwzLHLdK9HRnRpfqfd4tGNzlS1FZC8wtvzDF0ZCja2ZBc6zRMjnAmfuZAgIcvmpwC1ZCwkAQSLpLMPnCwRK7qW2BYQko4N1EU4hZCZCXdHMUgqNDJho3iuPrxJQHUFhQ4cG40Mh6ZAzzxruw2Fh14tOr1MaXXZA4wZDZD";

// Function to hash the input string using SHA-256
function hashString(value) {
  if (!value) return null; // Handle null or undefined values
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Function to send events to Meta
async function sendToMeta() {
  console.log("sendToMeta trigger");

  // Hardcoded email and phone
  const hashedEmail = hashString("testuser@example.com"); // Replace with actual email
  const hashedPhone = hashString(null); // Intentionally null to match your structure

  const eventData = {
    currency: "USD",
    value: "142.52",
  };

  const testEventCode = "TEST57343"; // Replace with your actual test event code

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${PIXEL_ID}/events`,
      {
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            user_data: {
              em: [hashedEmail],
              ph: [hashedPhone],
            },
            custom_data: eventData,
            original_event_data: {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
            },
          },
        ],
        access_token: ACCESS_TOKEN,
        test_event_code: testEventCode, // Test Event Code for instant visibility
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
  console.log("Hardcoded event triggered.");
  
  // Call function to send hardcoded event to Meta
  sendToMeta();

  // Respond to the frontend
  res.status(200).send({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
