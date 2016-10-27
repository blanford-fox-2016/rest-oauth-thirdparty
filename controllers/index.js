var Profile = require('../models/profile')


function viewHome (req, res) {
    res.render('index', {title: "Home"})
}

function getProfile (req, res) {
    Profile.find({}, function (err, profiles) {
        if (err)
            throw err

        res.render('/profile', {title: "Profile", profiles:profiles})
    })
}

module.exports = {
    viewHome: viewHome
}