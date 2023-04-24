var express = require('express');
var router = express.Router();
const { orders, adminProductView, adminCancelOrder, shippingStatus, userOrderView, sessionCheck, orderCancel, userProductView, orderDetails, orderReturn, adminReturnedOrder } = require('../Controller/order_controller')
const { verifyUser } = require("../Controller/auth");
const {adminSessionCheck} = require('../Controller/admin_controller')

router.get('/Orders',adminSessionCheck, orders)
router.get('/adminProductView/:id', adminSessionCheck,adminProductView)
router.post('/adminCancelOrder/:id',adminSessionCheck, adminCancelOrder)
router.post('/shippingStatus/:id',adminSessionCheck, shippingStatus)
router.get('/UserOrderView', verifyUser, sessionCheck, userOrderView)
router.post('/OrderCancel/:id', verifyUser,sessionCheck, orderCancel)
router.get('/userProductView/:id', verifyUser,sessionCheck, userProductView)
router.get('/OrderDetails', verifyUser, sessionCheck, orderDetails)
router.post('/OrderReturn/:id', verifyUser, sessionCheck, orderReturn)
router.post('/adminReturnedOrder/:id',adminSessionCheck, adminReturnedOrder)
module.exports = router;