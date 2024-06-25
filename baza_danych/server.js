const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mqtt = require("mqtt");
const fs = require('fs');
const path = require('path');
const Product = require("./models/Product");

const dbUri = process.env.MONGO_URI;

const mqttUrl = "ws://hivemq-biedronka:8000/mqtt";

const mqttClient = mqtt.connect(mqttUrl);

async function AddProduct(name, price, description) {
  try {
    const existingProduct = await Product.findOne({ name: name });
    if (existingProduct) {
      console.log(`Product with name ${name} already exists.`);
    } else {
      const newProduct = new Product({ name, price, description });
      await newProduct.save();
      console.log(`Product ${name} added successfully.`);
    }
  } catch (err) {
    console.error("Error adding product:", err);
    throw err;
  }
}

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

app.use(require("./routes/ProductRoute"));

async function connectToServer() {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
      AddProduct("Mleko", 2.59, "Mleko 3.2% tłuszczu 1l");
      AddProduct("Chleb", 1.29, "Chleb pszenny 500g");
      AddProduct("Jajka", 3.19, "Jajka wiejskie 10 sztuk");
      AddProduct("Ser", 4.59, "Ser żółty Gouda 200g");
      AddProduct("Woda", 0.99, "Woda mineralna niegazowana 1.5l");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
app.listen(port, () => {
  connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on ${port}`);
});
