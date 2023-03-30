var express = require('express');
var router = express.Router();
const{Orders,adminProductView,adminCancelOrder,shippingStatus,UserOrderView,sessioncheck,OrderCancel,userProductView,OrderDetails,OrderReturn,adminReturnedOrder}=require('../Controller/order_controller')
const {verifyUser}= require("../Controller/auth");

router.get('/Orders',Orders)
router.get('/adminProductView/:id',adminProductView)
router.post('/adminCancelOrder/:id',adminCancelOrder)
router.post('/shippingStatus/:id',shippingStatus)
router.get('/UserOrderView',verifyUser,sessioncheck,UserOrderView)
router.post('/OrderCancel/:id',verifyUser,OrderCancel)
router.get('/userProductView/:id',verifyUser,userProductView)
router.get('/OrderDetails',verifyUser,sessioncheck,OrderDetails)
router.post('/OrderReturn/:id',verifyUser,OrderReturn)
router.post('/adminReturnedOrder/:id',adminReturnedOrder)
module.exports = router;