var express = require("express");
var router = express.Router();
const User = require("../models/users");

router.get("/:username", (req, res) => {
  User.find().then((data) => {
    const foundUsers = [];
    data.map((user, i) => {
      let found = true;
      for (let i = 0; i < req.params.username.length; i++) {
        if (i > user.username.length) found = false;
        if (i < user.username.length)
          if (
            req.params.username[i].toLowerCase() !=
            user.username[i].toLowerCase()
          )
            found = false;
      }
      if (found) foundUsers.push(user.username);
    });
    res.json({ users: foundUsers });
  });
});

router.get("/tags/:instrument", (req, res) => {
  User.find().then((data) => {
    const foundUsers = [];
    data.map((user) => {
      let found = false;
      for (let i = 0; i < user.tags.length; i++) {
        if (req.params.instrument.toLowerCase() === user.tags[i].toLowerCase())
          found = true;
      }
      if (found) foundUsers.push(user.username);
    });
    res.json({ users: foundUsers });
  });
});

router.get("/teacher/:instrument", (req, res) => {
  User.find().then((data) => {
    const foundUsers = [];
    data.map((user) => {
      let found = false;
      for (let i = 0; i < user.teacher.length; i++) {
        console.log(user.teacher[i], user.username);
        if (
          req.params.instrument.toLowerCase() === user.teacher[i].toLowerCase()
        )
          found = true;
      }
      if (found) foundUsers.push(user.username);
    });
    res.json({ users: foundUsers });
  });
});

module.exports = router;
