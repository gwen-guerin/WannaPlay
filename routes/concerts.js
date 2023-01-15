var express = require('express');
var router = express.Router();
const Concert = require('../models/concerts');
const fetch = require('node-fetch');
require('../models/connection');

router.get('/', (req, res) => {
  let array = [];
  Concert.find().then((data) => {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        array.push({
          eventName: data[i].eventName,
          style: data[i].style,
          date: data[i].date,
          place: data[i].place,
        });
      }
      res.json({ result: true, concerts: array });
    }
  });
});

router.post("/createConcert", (req, res) => {
  const { eventName, date, style, place } = req.body;

  Concert.findOne({ eventName: eventName }).then((data) => {
    if (data === null) {
      const newConcert = new Concert({
        eventName: eventName,
        date: date,
        style: style,
        place: place,
      });
      newConcert.save().then((data) => {
        res.json({ result: true, eventName: data });
      });
    } else {
      res.json({ result: false, error: 'Concert already exists' });
    }
  });
});

module.exports = router;
