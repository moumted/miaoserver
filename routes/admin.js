var express = require('express');
var adminController = require('../controllers/admin')
var router = express.Router();


// router.get('/',adminController)
router.get('/userlist',adminController.usersList);
router.post('/updateFreeze',adminController.updateFreeze);
router.post('/deleteList',adminController.deleteList);
module.exports = router;