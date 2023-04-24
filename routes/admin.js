var express = require('express');
var router = express.Router();
const { uploadMultiple } = require('../middlewares/multer')
const { adminLogin, adminRegisterd, allUsers, blockManagement, dashboard, addBanner, addedBanner, editBanner, editedBanner, todayOrderList, weekSales, monthSales, yearSales, totalRevenue, salesReport, addCoupon, addedCoupon, allCoupons, allOffers, categoryOffer, showProductOffer, showCategoryOffer, editCoupon, editedCoupon, deleteCoupon, nocache, loginRedirect, adminSessionCheck} = require('../Controller/admin_controller')



/* GET users listing. */
router.get('/',nocache,loginRedirect ,adminLogin);
router.post('/adminLoged', adminRegisterd)
router.get('/AllUsers',adminSessionCheck, allUsers)
// router.post('/delete-pro/:id',deleteProduct)
router.post('/Block/:id',adminSessionCheck, blockManagement)
router.get('/dashboard',adminSessionCheck, dashboard)
router.get('/Banner',adminSessionCheck, addBanner)
router.post('/AddedBanner',adminSessionCheck, addedBanner)
router.get('/edit-banner/:id',adminSessionCheck, editBanner)
router.post('/EditedBanner/:id', adminSessionCheck,editedBanner)
router.get('/TodayOrderList',adminSessionCheck, todayOrderList)
router.get('/Weeksales',adminSessionCheck, weekSales)
router.get('/Monthsales',adminSessionCheck, monthSales)
router.get('/Yearsales',adminSessionCheck, yearSales)
router.get('/TotalRevenue',adminSessionCheck, totalRevenue)
router.get('/SalesReport',adminSessionCheck, salesReport)
router.get('/AddCoupon',adminSessionCheck, addCoupon)
router.post('/AddedCoupon', adminSessionCheck,addedCoupon)
router.get('/AllCoupons',adminSessionCheck, allCoupons)
router.get('/AllOffers', adminSessionCheck,allOffers)
router.get('/ShowProductOffer', adminSessionCheck,showProductOffer)
router.get('/ShowCategoryOffer', adminSessionCheck,showCategoryOffer)

router.get('/CategoryOffer', adminSessionCheck, categoryOffer)
router.get('/editCoupon/:id', adminSessionCheck, editCoupon)
router.post('/EditedCoupon/:id',adminSessionCheck, editedCoupon)
router.get('/deleteCoupon/:id',adminSessionCheck, deleteCoupon)
module.exports = router;
