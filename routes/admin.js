var express = require('express');
var router = express.Router();
const { uploadMultiple } = require('../middlewares/multer')
const { adminLogin, adminRegisterd, allUsers, blockManagement, dashboard, addBanner, addedBanner, editBanner, editedBanner, todayOrderList, weekSales, monthSales, yearSales, totalRevenue, salesReport, addCoupon, addedCoupon, allCoupons, allOffers, categoryOffer, showProductOffer, showCategoryOffer, editCoupon, editedCoupon, deleteCoupon, nocache, loginRedirect, adminSessionCheck , adminLogout} = require('../Controller/adminController')



/* GET users listing. */
router.get('/',nocache,loginRedirect ,adminLogin);
router.post('/adminLoged', adminRegisterd)
router.get('/allUsers',adminSessionCheck, allUsers)
// router.post('/delete-pro/:id',deleteProduct)
router.post('/block/:id',adminSessionCheck, blockManagement)
router.get('/dashboard', dashboard)
router.get('/banner',adminSessionCheck, addBanner)
router.post('/addedBanner',adminSessionCheck, addedBanner)
router.get('/editBanner/:id',adminSessionCheck, editBanner)
router.post('/editedBanner/:id', adminSessionCheck,editedBanner)
// router.get('/TodayOrderList',adminSessionCheck, todayOrderList)
// router.get('/Weeksales',adminSessionCheck, weekSales)
// router.get('/Monthsales',adminSessionCheck, monthSales)
// router.get('/Yearsales',adminSessionCheck, yearSales)
// router.get('/TotalRevenue',adminSessionCheck, totalRevenue)
router.get('/salesReport',adminSessionCheck, salesReport)
router.get('/addCoupon',adminSessionCheck, addCoupon)
router.post('/addedCoupon', adminSessionCheck,addedCoupon)
router.get('/allCoupons',adminSessionCheck, allCoupons)
router.get('/allOffers', adminSessionCheck,allOffers)
router.get('/showProductOffer', adminSessionCheck,showProductOffer)
router.get('/showCategoryOffer', adminSessionCheck,showCategoryOffer)

router.get('/CategoryOffer', adminSessionCheck, categoryOffer)
router.get('/editCoupon/:id', adminSessionCheck, editCoupon)
router.post('/editedCoupon/:id',adminSessionCheck, editedCoupon)
router.get('/deleteCoupon/:id',adminSessionCheck, deleteCoupon)
router.get('/adminLogout',adminLogout)
module.exports = router;
