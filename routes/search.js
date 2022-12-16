var express = require("express");
var router = express.Router();
const User = require("../models/users");
require("../models/connection");

router.get("/:username", (req, res) => {
  User.find().then((data) => {
    const foundUsers = [];
    data.map((user, i) => {
      let found = true;
      for (let i = 0; i < req.params.username.length; i++) {
        if (req.params.username[i] != user.username[i]) found = false;
      }
      if (found) foundUsers.push(user);
    });
    res.json({ users: foundUsers });
  });
});

module.exports = router;
