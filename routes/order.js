var express = require('express');
var router = express.Router();
const { orders, adminProductView, adminCancelOrder, shippingStatus, userOrderView, sessionCheck, orderCancel, userProductView, orderDetails, orderReturn, adminReturnedOrder } = require('../Controller/orderController')
const { verifyUser } = require("../Controller/auth");
const {adminSessionCheck} = require('../Controller/adminController')

router.get('/orders',adminSessionCheck, orders)
router.get('/adminProductView/:id', adminSessionCheck,adminProductView)
router.post('/adminCancelOrder/:id',adminSessionCheck, adminCancelOrder)
router.post('/shippingStatus/:id',adminSessionCheck, shippingStatus)
router.get('/userOrderView', verifyUser, sessionCheck, userOrderView)
router.post('/orderCancel/:id', verifyUser,sessionCheck, orderCancel)
router.get('/userProductView/:id', verifyUser,sessionCheck, userProductView)
router.get('/orderDetails', verifyUser, sessionCheck, orderDetails)
router.post('/orderReturn/:id', verifyUser, sessionCheck, orderReturn)
router.post('/adminReturnedOrder/:id',adminSessionCheck, adminReturnedOrder)
module.exports = router;