var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");
const Chat = require("../models/chats");

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

router.get("/allMessages/:chatName", (req, res) => {
  Chat.findOne({ chatName: req.params.chatName }).then((data) => {
    if (data.messages.length > 0)
      res.json({ result: true, messages: data.messages });
    else res.json({ result: false });
  });
});

router.get("/allChats/:username", (req, res) => {
  const foundChats = [];
  User.findOne({ username: req.params.username })
    .populate("chats")
    .then((chat) => {
      chat.chats.map((data) => {
        if (data.users[0] === req.params.username)
          foundChats.push({ friend: data.users[1], chatName: data.chatName });
        if (data.users[1] === req.params.username) {
          foundChats.push({ friend: data.users[0], chatName: data.chatName });
        }
      });
      res.json({ result: true, allChats: foundChats });
    });
});

// Create chat in database
router.post("/createChat", (req, res) => {
  let exists = false;
  let chatId;
  User.findOne({ username: req.body.username })
    .populate("chats")
    .then((data) => {
      if (data.chats.length > 0) {
        data.chats.map((chat) => {
          if (
            chat.users[0] === req.body.username ||
            chat.users[1] === req.body.username
          )
            if (
              chat.users[0] === req.body.secondUser ||
              chat.users[1] === req.body.secondUser
            ) {
              exists = true;
              return res.json({ result: false, chatName: chat.chatName, friend: req.body.secondUser })
            }
        });
      }
    })
    .then(() => {
      if (exists === false) {
        const chatname = req.body.username + req.body.secondUser;
        const newChat = new Chat({
          chatName: chatname,
          users: [req.body.username, req.body.secondUser],
          messages: [],
        });
        newChat.save().then((newChat) => {
          chatId = newChat._id;
          User.findOneAndUpdate(
            { username: req.body.username },
            {
              $push: {
                chats: chatId,
              },
            }
          ).then((newChat2) => {
            User.findOneAndUpdate(
              { username: req.body.secondUser },
              {
                $push: {
                  chats: chatId,
                },
              }
            ).then(() => {
              User.findOne({ username: req.body.username })
                .populate("chats")
                .then((update) => {
                  Chat.findOne({_id: chatId}).then(chat => {
                    return res.json({
                      result: true,
                      success: "Chat successfully created!",
                      chatName: chat.chatName,
                      friend: req.body.secondUser
                  })
                  });
                });
            });
          });
        });
      }
    });
});

// Join chat
router.post("/joinChat", (req, res) => {
  pusher.trigger(req.body.chatName, "join", {
    username: req.body.username,
  });

  res.json({ result: true });
});

// Leave chat
router.post("/leaveChat", (req, res) => {
  pusher.trigger(req.body.chatName, "leave", {
    username: req.body.username,
  });
  res.json({ result: true });
});

// Send message
router.post("/message", (req, res) => {
  pusher.trigger(req.body.chatName, "message", req.body.payload);
  Chat.findOneAndUpdate(
    { chatName: req.body.chatName },
    { $push: { messages: req.body.payload } }
  ).then(() => res.json({ result: true }));
});

module.exports = router;
