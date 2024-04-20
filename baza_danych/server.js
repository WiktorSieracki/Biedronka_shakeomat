const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mqtt = require("mqtt");
const fs = require('fs');
const path = require('path');

const dbUri = process.env.MONGO_URI;

const mqttUrl = "ws://localhost:8000/mqtt";

const mqttClient = mqtt.connect(mqttUrl);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("#", (err) => {
    if (err) {
      console.error("Error subscribing to topic:", err);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`${message}`);
  
  const messageStr = message.toString();
  const currDate = new Date();
  const filePath = path.join(__dirname, 'messages.txt');
  fs.appendFile(filePath, `${currDate}: ${messageStr}\n`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
});

app.use(require("./routes/UserRoute"));
app.use(require("./routes/ProductRoute"));
app.use(require("./routes/ChatRoute"));

async function connectToServer() {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
app.listen(port, () => {
  connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on ${port}`);
});
