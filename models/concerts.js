const mongoose = require("mongoose");

const concertsSchema = mongoose.Schema({
  eventName: String,
  style: String,
  date: String,
  place: String,
});

const Concert = mongoose.model("concerts", concertsSchema);
module.exports = Concert;
