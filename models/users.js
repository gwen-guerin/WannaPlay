const mongoose = require("mongoose");

const geolocSchema = mongoose.Schema({
  city: String,
  latitude: Number,
  longitude: Number,
});

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  token: String,
  location: geolocSchema,
  profilePicture: String,
  age: Number,
  teacher: Array,
  tags: Array,
  friends: Array,
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chats", username: String }],
  description: String,
  status: Boolean,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
