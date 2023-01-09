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
      if (found)
        foundUsers.push({
          username: user.username,
          profilePicture: user.profilePicture,
          location: user.location,
        });
    });
    console.log(foundUsers);
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
      if (found)
        foundUsers.push({
          username: user.username,
          profilePicture: user.profilePicture,
          location: user.location,
        });
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
      if (found)
        foundUsers.push({
          username: user.username,
          profilePicture: user.profilePicture,
          location: user.location,
        });
    });
    res.json({ users: foundUsers });
  });
});

router.get("/:tags", (req, res) => {
  User.find().then((data) => {
    console.log(data);
  });
});

router.post("/commonFriends", (req, res) => {
  const foundUsers = [];
  const foundFriends = [];
  User.findOne({ username: req.body.friend })
    .populate("chats")
    .then((me) => {
      me.chats.map((data, i) => {
        if (data.users[0] === req.body.friend) foundUsers.push(data.users[1]);
        if (data.users[1] === req.body.friend) {
          foundUsers.push(data.users[0]);
        }
      });
      console.log(foundUsers, "chats");
      User.findOne({ username: req.body.username })
        .then((user) => {
          console.log("friends", user.friends);
          console.log("foundFriends", foundUsers);
          user.friends.map((friend) => {
            foundUsers.map((chat) => {
              console.log("friend", chat, "userFriend", friend);
              if (friend == chat) {
                foundFriends.push(chat);
              }
            });
          });
          console.log("found", foundFriends);
        })
        .then(() => {
          foundFriends.map((friend, i) => {
            User.findOne({ username: friend }).then((user) => {
              foundFriends[i] = {
                friend: friend,
                profilePicture: user.profilePicture,
              };
            });
          });
          console.log("sorted", foundFriends);
          res.json({ result: true, allFriends: foundFriends });
        });
    });
});

function isNearer(first, second) {}

function sortByLocation(users, userLocation) {
  const usersWithDistances = users.map((user) => {
    const distance = Math.sqrt(
      Math.pow(userLocation.latidude - user.location.latitude, 2) +
        Math.pow(userLocation.longitude - user.location.longitude, 2)
    );
    return { ...user, distance };
  });

  usersWithDistances.sort((a, b) => a.distance - b.distance);

  return usersWithDistances;
}

module.exports = router;
