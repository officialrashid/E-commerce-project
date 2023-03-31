var express = require('express');
var router = express.Router();
const {uploadMultiple}=require('../middlewares/multer')
const {adminLogin,adminRegisterd,allUsers,blockManagement,dashboard,addBanner,addedBanner,editBanner,editedBanner,todayOrderList,weekSales,monthSales,yearSales,totalRevenue,salesReport,addCoupon,addedCoupon,allCoupons,allOffers,categoryOffer,showProductOffer,showCategoryOffer,editCoupon,editedCoupon,deleteCoupon}=require('../Controller/admin_controller')



/* GET users listing. */
router.get('/',adminLogin);
 router.post('/adminLoged',adminRegisterd)
router.get('/AllUsers',allUsers)
// router.post('/delete-pro/:id',deleteproduct)
router.post('/Block/:id',blockManagement)
router.get('/dashboard',dashboard)
router.get('/Banner',addBanner)
router.post('/AddedBanner',addedBanner)
router.get('/edit-banner/:id',editBanner)
router.post('/EditedBanner/:id',editedBanner)
router.get('/TodayOrderList',todayOrderList)
router.get('/Weeksales',weekSales)
router.get('/Monthsales',monthSales)
router.get('/Yearsales',yearSales)
router.get('/TotalRevenue',totalRevenue)
router.get('/SalesReport',salesReport)
router.get('/AddCoupon',addCoupon)
router.post('/AddedCoupon',addedCoupon)
router.get('/AllCoupons',allCoupons)
router.get('/AllOffers',allOffers)
router.get('/ShowProductOffer',showProductOffer)
router.get('/ShowCategoryOffer',showCategoryOffer)

router.get('/CategoryOffer',categoryOffer)
router.get('/editCoupon/:id',editCoupon)
router.post('/EditedCoupon/:id',editedCoupon)
router.get('/deleteCoupon/:id',deleteCoupon)
module.exports = router;
