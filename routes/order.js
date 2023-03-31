var express = require('express');
var router = express.Router();
const { orders, adminProductView, adminCancelOrder, shippingStatus, userOrderView, sessionCheck, orderCancel, userProductView, orderDetails, orderReturn, adminReturnedOrder } = require('../Controller/order_controller')
const { verifyUser } = require("../Controller/auth");

router.get('/Orders', orders)
router.get('/adminProductView/:id', adminProductView)
router.post('/adminCancelOrder/:id', adminCancelOrder)
router.post('/shippingStatus/:id', shippingStatus)
router.get('/UserOrderView', verifyUser, sessionCheck, userOrderView)
router.post('/OrderCancel/:id', verifyUser, orderCancel)
router.get('/userProductView/:id', verifyUser, userProductView)
router.get('/OrderDetails', verifyUser, sessionCheck, orderDetails)
router.post('/OrderReturn/:id', verifyUser, orderReturn)
router.post('/adminReturnedOrder/:id', adminReturnedOrder)
module.exports = router;