var express = require("express");
var router = express.Router();
const User = require("../models/users");
require("../models/connection");

router.get("/:username", (req, res) => {
  User.find({ username: req.params.username }).then((data) => {
    console.log(data);
    if (data) {
      res.json({ result: true, userList: data });
    } else {
      res.json({ result: false, error: "user not existing" });
    }
  });
});

module.exports = router;
