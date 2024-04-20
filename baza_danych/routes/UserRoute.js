const express = require("express");
const UserRoutes = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mqtt = require("mqtt");
const mqttClient = mqtt.connect("ws://localhost:8000/mqtt");
const { authenticateToken } = require("../middleware/Auth");

// Create a new user
UserRoutes.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    mqttClient.publish("users", `New user added: ${req.body.name}`);
    res.status(201).send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
UserRoutes.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

// Get a user by id
UserRoutes.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }
  res.send(user);
});

// Update a user by id
UserRoutes.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send();
  }
  updates.forEach((update) => (user[update] = req.body[update]));
  await user.save();
  try {
    mqttClient.publish("users", `User updated: ${req.body.name}`);
  } catch (err) {
    console.log(err);
  }
  res.send(user);
});

// Delete a user by id
UserRoutes.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).send();
  }
  mqttClient.publish("users", `User deleted: ${user.name}`);
  res.send(user);
});

// login user
UserRoutes.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send();
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).send();
  }

  const token = jwt.sign(user.toObject(), process.env.JWT_SECRET);
  res.send({ token });
});

// Get a random promotion for a user
UserRoutes.get(
  "/users/promotions/random",
  authenticateToken,
  async (req, res) => {
    const logged_in_user_id = req.logged_in_user_id;
    const user = await User.findById(logged_in_user_id);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    if (user.promotionDate !== null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const promotionDate = new Date(user.promotionDate);
      promotionDate.setHours(0, 0, 0, 0);
      if (promotionDate.getTime() === today.getTime()) {
        mqttClient.publish(
          "users",
          `You tried to get a promotion, but already got one today!`
        );
        return res
          .status(400)
          .send({ message: "You already got a promotion today!" });
      }
    }
    const promotion = await Product.aggregate([{ $sample: { size: 1 } }]);
    user.promotion = promotion[0];
    user.promotionDate = Date.now();
    const promotionName = await Product.findById(user.promotion);
    mqttClient.publish(
      "users",
      `User ${user.name} got a promotion: ${promotionName.name}`
    );
    await user.save();
    res.send(user);
  }
);
// get promotion for a user
UserRoutes.get("/users/:id/promotions", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ message: "User not found!" });
  }
  if (!user.promotion) {
    return res.status(404).send({ message: "No promotion for this user!" });
  }
  res.send(user.promotion);
});

module.exports = UserRoutes;
