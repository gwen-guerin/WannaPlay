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
  console.log("chatname", req.params.chatName);
  Chat.findOne({ chatName: req.params.chatName }).then((data) => {
    console.log(data);
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
      console.log(chat.chats);
      chat.chats.map((data) => {
        if (data.users[0] === req.params.username)
          foundChats.push({ friend: data.users[1], chatName: data.chatName });
        if (data.users[1] === req.params.username) {
          console.log("c la merde");
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
            console.log(newChat2._id);
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
                  console.log(update.chats[0].users);
                  return res.json({
                    result: true,
                    success: "Chat successfully created!",
                  });
                });
            });
          });
        });
      } else return res.json({ result: false, error: "Chat already exists!" });
    });
});

// Join chat
router.put('/:username', (req, res) => {
  pusher.trigger('chat', 'join', {
    username: req.params.username,
  });

  res.json({ result: true });
});

// Leave chat
router.delete("/:username", (req, res) => {
  pusher.trigger('chat', 'leave', {
    username: req.params.username,
  });
  // console.log('messages',req.body.messages)
  // Chat.findOneAndUpdate(
  //   { chatName: req.body.chatName },
  //   { $push: { messages: req.body.messages } }
  // ).then((data) => console.log('pk?',data.messages));
  res.json({ result: true });
});

// Send message
router.post('/message', (req, res) => {
  pusher.trigger('chat', 'message', req.body);

  res.json({ result: true });
});

module.exports = router;
