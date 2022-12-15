var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');
const {userlandingpage,userLoged,LoginandSignupButton,userRegistered,productDetails} = require('../Controller/user_controller');
/* GET home page. */

router.get('/',userlandingpage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',LoginandSignupButton)
router.get('/productDetails/:id',productDetails)
module.exports = router;
