let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.all);
router.post('/register', userController.register);
router.post('/login', passport.authenticate('local'), userController.login);
router.put('/edit/:id', userController.edit);
router.delete('/delete/:id', userController.destroy);

module.exports = router;
