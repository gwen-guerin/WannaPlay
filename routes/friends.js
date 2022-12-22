var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");

router.post("/addFriend", (req, res) => {
  User.findOne({ username: req.body.username }).then((data) => {
    data.friends.map((friend) => {
      if (friend === req.body.friend) res.json({ result: false });
    });
  });
  User.findOneAndUpdate(
    { username: req.body.username },
    { $push: { friends: req.body.friend } }
  ).then(() => res.json({ result: true }));
});

router.post("/removeFriend", (req, res) => {
  User.findOneAndUpdate(
    { username: req.body.username },
    { $pull: { friends: req.body.friend } }
  ).then(() => res.json({ result: true }));
});

router.get("/getFriends/:username", (req, res) => {
    User.findOne({username: req.params.username}).then(data => res.json({result: true, friends: data.friends}))
  })

module.exports = router;