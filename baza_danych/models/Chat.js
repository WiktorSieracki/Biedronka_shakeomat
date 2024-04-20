const mongoose = require("mongoose");
const mqtt = require("mqtt");
const mqttClient = mqtt.connect("ws://localhost:8000/mqtt");
const User = require("./User");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: { type: [MessageSchema], default: [] },
});

ChatSchema.pre("save", async function (next) {
  const user1 = await User.findById(this.user1);
  const user2 = await User.findById(this.user2);
  if (this.isNew) {
    mqttClient.publish(
      "chats",
      `New chat created: ${user1.name} ${user2.name}`
    );
  }
  if (this.isModified("messages")) {
    newMessage = this.messages[this.messages.length - 1];
    mqttClient.publish("chats", `${newMessage.sender}: ${newMessage.content}`);
  }
  next();
});

module.exports = mongoose.model("Chat", ChatSchema);
