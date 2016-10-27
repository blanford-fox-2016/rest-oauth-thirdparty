let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.passport && req.session.passport.user != undefined) {
    res.redirect('/users/profile');
  } else {
    res.render('index', { title: 'Express', data: req.session.passport });
  }
});

module.exports = router;
