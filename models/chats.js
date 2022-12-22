const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  chatName: String,
  users: Array,
  messages: [{ text: String, username: String, createdAt: Date, id: Number }],
});

const Chat = mongoose.model("chats", chatSchema);

module.exports = Chat;
