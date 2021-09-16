var express = require('express');
var UsersController = require('../controllers/users')
var router = express.Router();

var multer = require('multer');
var upload = multer({dest : 'public/uploads/'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login' ,UsersController.login );
router.post('/register' ,UsersController.register );
router.get('/verify' ,UsersController.verify );
router.get('/logout' ,UsersController.logout );
router.get('/getUser' ,UsersController.getUser );
router.post('/findPassword' ,UsersController.findPassword );
router.get('/imgCode' , UsersController.captcha);
router.post('/uploadUserHead',upload.single('file'),UsersController.uploadUserHead);

module.exports = router;
