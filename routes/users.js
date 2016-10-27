let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
let passport = require('passport');

/* GET users listing. */
router.get('/', userController.all);
router.post('/register', userController.register);
router.post('/login', passport.authenticate('local'), userController.login);
router.get('/logout', userController.logout);
router.put('/edit/:id', userController.edit);
router.delete('/delete/:id', userController.destroy);
router.get('/profile', userController.profile)

module.exports = router;
