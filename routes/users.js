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
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, error: "user not existing" });
    }
  });
});

router.post("/signup", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  // console.log("coucou", hash);

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
        });
        newUser.save().then((newUser) => {
          res.json({ result: true, user: newUser });
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

// router.post('/signupForm', (req, res) => {
//   const { age, city, department, teacher, instruTaught, singer, tags } = req.body;
//   if (!checkBody(req.body, ['age', 'city', 'department', 'teacher', 'instruTaught', 'singer', 'tags'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   if (token) {
//     User.findOne({ token: token }).then((data) => {
//       if (data === null) {
//         const newUser = new User({
//           firstname,
//           lastname,
//           username,
//           email,
//           password: hash,
//           token: uid2(32),
//         });

//         newUser.save().then((newUser) => {
//           res.json({ result: true, user: newUser });
//         });
//       } else {
//         // User already exists in database
//         res.json({ result: false, error: 'User already exists' });
//       }
//     });
//   } else {
//     res.json({ result: false, error: 'Missing or empty fields' });
//   }
// });

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const { username, password } = req.body;
  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
    } else {
      res.json({ result: true, user: data });
    }
  });
});

// router.get("/allUsers", (req, res) => {
//   const usernames = [];
//   User.find().then((data) => {
//     data.map((user) => {
//       usernames.push(user.username);
//     });
//     res.json({ result: true, usernames: usernames });
//   });
// });

//route pour récupérer tous les utilisateurs
router.get("/allUsers", (req, res) => {
   User.find().then((data) => {
    res.json({ result: true, usersList: data });
  });
});



router.post("/geoloc", (req, res) => {
  console.log(req.body)
  User.findOneAndUpdate({username: req.body.username}, {location: req.body.location}).then(data => {
    User.findOne({username: req.body.username}).then(user => res.json({result: true, user: user}))
  })
})

module.exports = router;
