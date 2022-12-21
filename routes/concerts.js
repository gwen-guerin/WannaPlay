var express = require("express");
var router = express.Router();
const Concert = require("../models/concerts");
const fetch = require("node-fetch");
require("../models/connection");

// router.get('/', (req, res) => {
//   Concert.find().then((data) => {
//     console.log('concerts', data);
//     if (data) {
//       data.map((concert, i) => {
//         res.json({
//           result: true,
//           concert: {
//             eventName: data[i].eventName,
//             date: data[i].date,
//             style: data[i].style,
//             place: data[i].place,
//           },
//         });
//       });
//     }
//   });
// });

// router.post("/createConcert", (req, res) => {
//   const { eventName, date, type, places } = req.body;

//   Concert.findOne({ eventName: eventName }).then((data) => {
//     if (data === null) {
//       const newConcert = new Concert({
//         eventName: eventName,
//         date: date,
//         type: type,
//         places: places,
//       });
//       newConcert.save().then((data) => {
//         res.json({ result: true, eventName: data });
//       });
//     } else {
//       res.json({ result: false, error: 'Concert already exists' });
//     }
//   });
// });

module.exports = router;
