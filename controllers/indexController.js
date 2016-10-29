'use strict'

let viewIndex = (req, res, next) => {
  res.render('home', { user: req.user });
}

module.exports = {
  viewIndex: viewIndex
}
