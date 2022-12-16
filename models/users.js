const mongoose = require('mongoose');

const geolocSchema = mongoose.Schema({
  city: String,
  latitude: Number,
  longitude: Number,
})

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  token: String,
  location: Object,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
