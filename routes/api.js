var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('home api')
})

module.exports = router;
