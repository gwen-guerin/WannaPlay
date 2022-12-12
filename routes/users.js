var express = require('express');
var router = express.Router();
const fetch = require('node-fetch')
require('../models/connection');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', (req, res) => {

  const { firstname, lastname, username, email, password } = req.body

  const hash = bcrypt.hashSync(password, 10);

  // Check if the user has not already been registered
  if (username && password) {
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
  } else {
    res.json({ result: false, error: 'Missing or empty fields' });
  }
});

router.post('/signin', (req, res) => {
  const { firstname, lastname, username, email, password } = req.body

  if (username && password) {
    User.findOne({ username: username }).then((data) => {
      if (data === null) {
        res.json({ result: false, error: 'User not found' });
      } else {
        res.json({ result: true , user: data});
      }
    });
  } else {
    res.json({ result: false, error: 'Missing or empty fields' });
  }
});


module.exports = router;
