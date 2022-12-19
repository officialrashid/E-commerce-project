var express = require('express');
var router = express.Router();
var user_helpers=require('../Controller/user_controller');
const {userlandingpage,userLoged,LoginandSignupButton,userRegistered,productDetails,sessioncheck,Logout,nocache,loginredirect,verifyLogin,ShopButton,categoryfilter,AddtoCart,CartPage} = require('../Controller/user_controller');
/* GET home page. */

router.get('/',userlandingpage);
router.post('/Userlogin',userLoged);
router.post('/UserRegister',userRegistered)
router.get('/LoginandSignupButton',nocache,loginredirect,LoginandSignupButton)
router.get('/productDetails/:id',sessioncheck,productDetails)
router.get('/Logout',Logout)
// router.get('/AddtoCart/:id',verifyLogin,AddtoCart)
router.get('/ShopButton',ShopButton)
router.post('/categoryfilter',categoryfilter)
router.get('/Add-to-cart/:id',sessioncheck,AddtoCart)
router.get('/CartPage',sessioncheck,CartPage)
module.exports = router;
