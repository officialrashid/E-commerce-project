var express = require('express');
var router = express.Router();
const {uploadMultiple}=require('../middlewares/multer')
const {adminlogin,adminRegisterd,AllUsers,blockmanagement,dashboard,AddBanner,AddedBanner,editbanner,EditedBanner,TodayOrderList,Weeksales,Monthsales,Yearsales,TotalRevenue,SalesReport,AddCoupon,AddedCoupon,AllCoupons,AllOffers,CategoryOffer,ShowProductOffer,ShowCategoryOffer,editCoupon,EditedCoupon,deleteCoupon}=require('../Controller/admin_controller')



/* GET users listing. */
router.get('/',adminlogin);
 router.post('/adminLoged',adminRegisterd)
router.get('/AllUsers',AllUsers)
// router.post('/delete-pro/:id',deleteproduct)
router.post('/Block/:id',blockmanagement)
router.get('/dashboard',dashboard)
router.get('/Banner',AddBanner)
router.post('/AddedBanner',AddedBanner)
router.get('/edit-banner/:id',editbanner)
router.post('/EditedBanner/:id',EditedBanner)
router.get('/TodayOrderList',TodayOrderList)
router.get('/Weeksales',Weeksales)
router.get('/Monthsales',Monthsales)
router.get('/Yearsales',Yearsales)
router.get('/TotalRevenue',TotalRevenue)
router.get('/SalesReport',SalesReport)
router.get('/AddCoupon',AddCoupon)
router.post('/AddedCoupon',AddedCoupon)
router.get('/AllCoupons',AllCoupons)
router.get('/AllOffers',AllOffers)
router.get('/ShowProductOffer',ShowProductOffer)
router.get('/ShowCategoryOffer',ShowCategoryOffer)

router.get('/CategoryOffer',CategoryOffer)
router.get('/editCoupon/:id',editCoupon)
router.post('/EditedCoupon/:id',EditedCoupon)
router.get('/deleteCoupon/:id',deleteCoupon)
module.exports = router;
