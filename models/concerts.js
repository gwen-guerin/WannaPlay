const mongoose = require("mongoose");

const concertsSchema = mongoose.Schema({
  eventName: String,
  type: String,
  date: String,
  places: String,
});

const Concert = mongoose.model("concerts", concertsSchema);
module.exports = Concert;
