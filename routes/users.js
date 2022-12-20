var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
require("../models/connection");
const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/CheckBody");

//route pour retrouver le user pour la page profile
router.get("/profile/:username", function (req, res) {
  User.findOne({ username: req.params.username }).then((data) => {
    if (data) {
      console.log("BACK DATA", data);
      res.json({
        result: true,
        user: {
          firstname: data.firstname,
          username: data.username,
          tags: data.tags,
          friends: data.friends,
          description: data.description,
          city: data.location.city,
          age: data.age,
          teacher: data.teacher,
          profilePicture: data.profilePicture
        },
      });
    } else {
      res.json({ result: false, error: "user not existing" });
    }
  });
});

//ROUTE SIGNUP
router.post("/signup", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  // Check if the user has not already been registered
  if (username) {
    User.findOne({ username: username }).then((data) => {
      if (data === null) {
        const newUser = new User({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: hash,
          token: uid2(32),
          profilePicture:
            "https://res.cloudinary.com/dr2opzcia/image/upload/v1671459986/w8aeavlzceo9jihz2wu8.jpg",
        });
        newUser.save().then((newUser) => {
          res.json({ result: true, user: newUser.username });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: "User already exists" });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

// ROUTE DU FORM POUR MAJ LA DB avec les infos
router.post("/signupForm", (req, res) => {
  const { age, teacher, tags, username } = req.body;
  if (!checkBody(req.body, ["age", "teacher", "tags"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOneAndUpdate(
    { username: username },
    { age: age, teacher: teacher, tags: tags }
  ).then((data) => res.json(data));
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const { username, password } = req.body;
  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
    } else {
      // console.log(data);
      if (bcrypt.compareSync(password, data.password)) {
        res.json({ result: true, user: data });
        // console.log(user);
      } else {
        res.json({ result: false });
      }
    }
  });
});

//route pour récupérer tous les utilisateurs
router.get("/allUsers", (req, res) => {
  User.find().then((data) => {
    res.json({ result: true, usersList: data });
  });
});

router.post("/photo", (req, res) => {
  User.findOneAndUpdate(
    { username: req.body.username },
    { profilePicture: req.body.photoUrl }
  ).then((data) => res.json({ result: true }));
});

// ROUTE de MAJ DES DONNEES PERSO DANS LA PROFIL
router.post("/updateProfile", (req, res) => {
  const { age, username, teacher, tags, description } = req.body;
  if (!checkBody(req.body, ["age"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOneAndUpdate(
    { username: username },
    { age: age, teacher, tags, description }
  ).then((data) => res.json(data));
});

router.post("/geoloc", (req, res) => {
  console.log(req.body);
  User.findOneAndUpdate(
    { username: req.body.username },
    { location: req.body.location }
  ).then((data) => {
    User.findOne({ username: req.body.username }).then((user) =>
      res.json({ result: true })
    );
  });
});

router.post("/friend", (req, res) => {
  User.findOne({ username: req.body.username }).then((data) => {});
});

router.get("/getFriends/:username", (req, res) => {
  User.findOne({username: req.params.username}).then(data => res.json({result: true, friends: data.friends}))
})

module.exports = router;
