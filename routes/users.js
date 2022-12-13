var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/CheckBody')
//route pour retrouver le user pour la page profile
router.get('/profile/:username', function (req, res) {
  User.findOne({ username: req.params.username }).then((data) => {
    // console.log(data)
    if (data) {
      res.json({ result: true, userList: data });
    } else {
      res.json({ result: false, error: 'user not existing' });
    }
  });
});

router.post('/signup', (req, res) => {
  if (
    !checkBody(req.body, [
      'username',
      'email',
      'password',
      'firstname',
      'lastname',
    ])
  ) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { firstname, lastname, username, email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  // Check if the user has not already been registered
  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      const newUser = new User({
        firstname,
        lastname,
        username,
        email,
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
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const {  username, password } = req.body;
  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: 'User not found' });
    } else {
      res.json({ result: true, user: data });
    }
  });
});

module.exports = router;
