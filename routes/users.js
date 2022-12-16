var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/CheckBody');

//route pour retrouver le user pour la page profile
router.get('/profile/:username', function (req, res) {
  User.findOne({ username: req.params.username }).then((data) => {
    if (data) {
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, error: 'user not existing' });
    }
  });
});

//ROUTE SIGNUP
router.post('/signup', (req, res) => {
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
        });
        newUser.save().then((newUser) => {
          res.json({ result: true, user: newUser });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: 'User already exists' });
      }
    });
  } else {
    res.json({ result: false, error: 'Missing or empty fields' });
  }
});

// ROUTE DU FORM POUR MAJ LA DB avec les infos
router.post('/signupForm', (req, res) => {
  const { age, teacher, tags, username } = req.body;
  // console.log("AGE", age);
  // console.log(username);
  if (!checkBody(req.body, ['age', 'teacher', 'tags'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOneAndUpdate(
    { username: username },
    { age: age, teacher: teacher, tags: tags }
  ).then((data) => res.json(data));
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const { username, password } = req.body;
  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: 'User not found' });
    } else {
      // res.json({ result: true, user: data });
      if (bcrypt.compareSync(password, data.password)) {
        res.json({ result: true });
      } else {
        res.json({ result: false });
      }
    }
  });
});

router.get('/allUsers', (req, res) => {
  const usernames = [];
  User.find().then((data) => {
    data.map((user) => {
      usernames.push(user.username);
    });
    res.json({ result: true, usernames: usernames });
  });
});

router.post('/geoloc', (req, res) => {
  // console.log(req.body)
  User.findOneAndUpdate(
    { username: req.body.username },
    { location: req.body.location }
  ).then((data) => {
    User.findOne({ username: req.body.username }).then((user) =>
      res.json({ result: true, user: user })
    );
  });
});

router.post('/photo', (req, res) => {
  User.findOneAndUpdate({username: req.body.username}, {profilePicture: req.body.photoUrl}).then(data => {
    User.findOne({username: req.body.username}).then(user => res.json({result: true, user: user}))
  })
})

module.exports = router;
