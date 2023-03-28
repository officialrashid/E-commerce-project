var express = require('express');
var router = express.Router();
const{Orders,adminProductView,adminCancelOrder,shippingStatus,UserOrderView,sessioncheck,OrderCancel,userProductView,OrderDetails,OrderReturn,adminReturnedOrder}=require('../Controller/order_controller')

router.get('/Orders',Orders)
router.get('/adminProductView/:id',adminProductView)
router.post('/adminCancelOrder/:id',adminCancelOrder)
router.post('/shippingStatus/:id',shippingStatus)
router.get('/UserOrderView',sessioncheck,UserOrderView)
router.post('/OrderCancel/:id',OrderCancel)
router.get('/userProductView/:id',userProductView)
router.get('/OrderDetails',sessioncheck,OrderDetails)
router.post('/OrderReturn/:id',OrderReturn)
router.post('/adminReturnedOrder/:id',adminReturnedOrder)
module.exports = router;