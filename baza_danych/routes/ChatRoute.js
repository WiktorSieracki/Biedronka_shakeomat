const express = require("express");
const ChatRoutes = express.Router();
const Chat = require("../models/Chat");
const { authenticateToken } = require("../middleware/Auth");
const User = require("../models/User");

// get all chats
ChatRoutes.get("/chats", async (req, res) => {
  const chats = await Chat.find({});
  res.send(chats);
});

// get chat by id
ChatRoutes.get("/chats/:id", async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).send();
  }
  res.send(chat);
});

// get chat by user id
ChatRoutes.get("/chats/user/:user", authenticateToken, async (req, res) => {
  const logged_in_user_id = req.logged_in_user_id;
  const user2 = req.params.user;
  const chat = await Chat.findOne({ user1: logged_in_user_id, user2: user2 });
  if (!chat) {
    if (logged_in_user_id === user2) {
      return res.status(400).send();
    }
    if (!chat) {
      const chat2 = await Chat.findOne({
        user1: user2,
        user2: logged_in_user_id,
      });
      if (!chat2) {
        return res.status(404).send();
      }
      res.send(chat2);
    }
    return res.status(404).send();
  }
  res.send(chat);
});

// create new chat
ChatRoutes.post("/chats/:id", authenticateToken, async (req, res) => {
  const logged_in_user_id = req.logged_in_user_id;
  const user2 = req.params.id;
  const CheckChat = await Chat.findOne({
    user1: logged_in_user_id,
    user2: user2,
  });
  const CheckChat2 = await Chat.findOne({
    user1: user2,
    user2: logged_in_user_id,
  });
  if (CheckChat || CheckChat2) {
    return res.status(400).send();
  }
  const chat = new Chat({
    user1: logged_in_user_id,
    user2: user2,
  });
  try {
    await chat.save();
    res.status(201).send(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

// send message
ChatRoutes.post("/chats/:id/message", authenticateToken, async (req, res) => {
  const logged_in_user_id = req.logged_in_user_id;
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).send();
  }
  const user1 = await User.findById(logged_in_user_id);
  const message = {
    sender: user1.name,
    content: req.body.content,
  };
  chat.messages.push(message);
  try {
    await chat.save();
    res.status(201).send(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete chat
ChatRoutes.delete("/chats/:id", async (req, res) => {
  const chat = await Chat.findByIdAndDelete(req.params.id);
  if (!chat) {
    return res.status(404).send();
  }
  res.send(chat);
});

// delete all chats
ChatRoutes.delete("/chats", async (req, res) => {
  const chats = await Chat.deleteMany({});
  res.send(chats);
});

module.exports = ChatRoutes;
