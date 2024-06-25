const express = require("express");
const ProductRoutes = express.Router();
const Product = require("../models/Product");
const authenticateToken = require("../middleware/Auth");
const isAdmin = require("../middleware/Admin");
const mqtt = require("mqtt");
const mqttClient = mqtt.connect("ws://hivemq-biedronka:8000/mqtt");
const jwt = require("jsonwebtoken");


// Create a new product
ProductRoutes.post("/products",[authenticateToken,isAdmin], async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  mqttClient.publish("products", `New product added: ${req.body.name}`);
  res.status(201).send(product);
});

// Get all products
ProductRoutes.get("/products", async (req, res) => {
  const search = req.query.search;
  let query = {};
  if (search) {
    query = {
      $or: [{ name: { $regex: search, $options: "i" } }],
    };
  }
  const products = await Product.find(query);
  if (!products) {
    return res.status(404).send();
  }
  res.send(products);
});

// Get a product by id
ProductRoutes.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send();
  }
  res.send(product);
});

// Update a product by id
ProductRoutes.patch("/products/:id",[authenticateToken,isAdmin], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "price", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).send();
  }
  mqttClient.publish("products", `Product updated: ${req.body.name}`);
  res.send(product);
});

// Delete a product by id
ProductRoutes.delete("/products/:id",[authenticateToken,isAdmin], async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  const name = product.name;

  if (!product) {
    return res.status(404).send();
  }
  mqttClient.publish("products", `Product deleted: ${name}`);
  res.send(product);
});

module.exports = ProductRoutes;
