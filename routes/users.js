var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const User = require('../Models/users')


//route pour retrouver le user pour la page profile
router.get('/profile/:username', function(req, res) {
User.findOne({username: req.params.username})
  .then(data => {
    // console.log(data)
    if(data) {
      res.json({result: true, userList: data})
  } else {
    res.json({result: false, error: 'user not existing'})
  }
})
});




module.exports = router;
