const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  status: Boolean,
  token: String,
  age: Number,
  tags: Array,
  teacher: Array,
  friends: Array,
  chats: Array,
});

const User = mongoose.model("users", userSchema);
module.exports = User;
