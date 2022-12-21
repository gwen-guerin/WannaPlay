var express = require("express");
var router = express.Router();
const Concert = require("../models/concerts");
const fetch = require("node-fetch");
require("../models/connection");

router.get("/", (req, res) => {
  Concert.find().then((data) => {
    console.log("concerts", data);
    if (data) {
      const allConcert = data.map((concert) => {
        console.log(concert);
        return {
          eventName: concert.eventName,
          date: concert.date,
          type: concert.type,
          places: concert.places,
        };
      });
      res.json({ result: true, concerts: allConcert });
    }
  });
});

router.post("/createConcert", (req, res) => {
  const { eventName, date, type, places } = req.body;
  console.log(req.body);
  Concert.findOne({ eventName: eventName }).then((data) => {
    if (data === null) {
      const newConcert = new Concert({
        eventName: eventName,
        date: date,
        type: type,
        places: places,
      });
      newConcert.save().then((wen) => {
        res.json({ result: true, eventName: wen });
      });
    } else {
      res.json({ result: false, error: "Concert already exists" });
    }
  });
});

module.exports = router;
