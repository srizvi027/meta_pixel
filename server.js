const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Replace with your Meta Pixel ID and Access Token
const PIXEL_ID = "592807929789990";
const ACCESS_TOKEN = "EAAhaFaSOtjsBO5SrVn5PX3mG7jbguZAas0gY9RM3RBAezDuj8glgPtAjIRygicZCmboqEVFpXHVICtRsKVZCkuTjya8aU1E1g2DPpLcVfWqMNtf1rxlDt1PnZBoKOyf0rmoCvInwNZAXQtXNlAH7ib61sWX73382iy4cWaFKJJZC051eOsMbn4sQ5MTcDBp2TXkwZDZD";

// Function to send events to Meta
async function sendToMeta(eventName, eventData) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${PIXEL_ID}/events`,
      {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: eventData.url,
            user_data: eventData.userData,
            custom_data: eventData.customData,
          },
        ],
        access_token: ACCESS_TOKEN,
      }
    );
    console.log("Event sent:", response.data);
  } catch (error) {
    console.error("Error sending event to Meta:", error.response?.data || error.message);
  }
}


// API endpoint to receive events from your website
app.post("/track-event", (req, res) => {
  const { eventName, eventData } = req.body;
  sendToMeta(eventName, eventData);
  res.status(200).send({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

