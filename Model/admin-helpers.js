var db = require('./connectionmongo');
var collection = require('./collections');
var bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');
const { shippingStatus } = require('../Controller/admin_controller');
const { promiseImpl } = require('ejs');

// const { adminresponse } = require('../app');

module.exports = {
  //   admin login check
  doAdminSignup: (adminData) => {

    // return new Promise(async(resolve,reject)=>{

    //     adminData.password=await bcrypt.hash(adminData.password,10)

    //     db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData)

    //     resolve(adminData)

    // })

    return new Promise(async (resolve, reject) => {

      let loginStatus = false;
      let adminresponse = {}

      let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ username: adminData.username })

      if (admin) {

        await bcrypt.compare(adminData.password, admin.password).then((adminDataStatus) => {

          if (adminDataStatus) {

            adminresponse.admin = admin
            adminresponse.adminDataStatus = true
            resolve(adminresponse)
          } else {

            reject({ error: "Incorrect password" })
          }

        })
      } else {
        reject({ error: "Incorrect username" })
      }
    })
    // admin log check end
  },

  // getAll users
  getAllUsers: () => {

    return new Promise(async (resolve, reject) => {

      let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
      resolve(users)

    })
    // getAll users End
  },

  removeProduct: (deleteid) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(deleteid) }).then((response) => {

        resolve(response)

      })
    })
  },




  userBlock: (userId, status) => {

    if (status == 'true') {

      status = false
    } else {
      status = true
    }
    return new Promise((resolve, reject) => {

      db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {

        $set: {

          isBlocked: status

        }
      }).then((response) => {

        console.log(response);
        resolve(response)
      })
    })
  },


  adminAddBanner: (BannerID) => {

    return new Promise(async (resolve, reject) => {
      var banner = await db.get().collection(collection.BANNER_COLLECTION).insertOne(BannerID)
      let data = {
        id: banner.insertedId
      }
      if (banner) {
        resolve(data)
      } else {
        reject()
      }
    }).catch((err) => {
      console.log(err);
    })

  },
  getAllBanners: () => {

    return new Promise(async (resolve, reject) => {

      let Banners = await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
      console.log("Banners Ethittund", Banners);
      resolve(Banners)
    })
  },
  editBanners: (productID) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.BANNER_COLLECTION).findOne({ _id: ObjectId(productID) }).then((product) => {

        resolve(product)
      })

    })

  },
  adminBannerEdit: (editid, body) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.BANNER_COLLECTION)
        .updateOne({ _id: ObjectId(editid) }, {

          $set: {


            Image: body.Image,

          },

        }).then((response) => {

          resolve()
        })

    })


  },
  totalSales: () => {

    return new Promise(async (resolve, reject) => {

      let TotalSales = await db.get().collection(collection.ORDER_COLLECTION).aggregate([

        { $group: { _id: null, count: { $sum: 1 } } }

      ]).toArray()

      resolve(TotalSales[0].count)

    })
  },
  todayOrders: () => {
    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
      try {
        const order = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $match: {
              date: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
              }
            }
          },

          { $group: { _id: null, count: { $sum: 1 } } }
        ]).toArray();
        console.log(order, "todayorder");
        if (order.length > 0) {
          resolve(order[0].count);
        } else {
          resolve(0);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }

    });
  },
  thisWeekOrders: () => {
    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
      const Weekorders = await db.get().collection(collection.ORDER_COLLECTION)
        .find({
          $and: [
            { date: { $lte: new Date() } },
            { date: { $gte: new Date(new Date().getDate() - 7) } },

          ],
        }).toArray();
      const count = Object.values(Weekorders).length;
      console.log(count, "Weekorder");
      resolve(count);
      try {
        const order = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $match: {
              date: {
                $lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7)
              }
            }
          },

          { $group: { _id: null, count: { $sum: 1 } } }
        ]).toArray();
        console.log(order, "todayorder");
        if (order.length > 0) {
          resolve(order[0].count);
        } else {
          resolve(0);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
  thisMonthOrders: () => {

    return new Promise(async (resolve, reject) => {
      const Monthorders = await db.get().collection(collection.ORDER_COLLECTION)
        .find({
          $and: [
            { date: { $lte: new Date() } },
            { date: { $gte: new Date(new Date().getDate() - 30) } },

          ],
        }).toArray();
      const count = Object.values(Monthorders).length;
      console.log(count, "Monthorders");
      resolve(count);
    });


  },
  thisYearOrders: () => {
    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
      const currentDate = new Date();
      const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);

      const yearOrderCount = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: {
            date: {
              $gte: new Date(currentDate.getFullYear(), -365),
              $lt: nextYear
            }
          }
        },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]).toArray();

      console.log(yearOrderCount);
      resolve(yearOrderCount[0].count)

    });
  },
  totalRevenues: () => {

    return new Promise(async (resolve, reject) => {


      let Result = await db.get().collection(collection.ORDER_COLLECTION).aggregate([

        { $match: { shippingStatus: 'Delivered' } },
        {
          $group: {
            _id: null,
            total: { $sum: '$TotalAmount' },
          },
        }
      ]).toArray()


      if (Result.length > 0 && Result[0]) {
        resolve(Result[0].total)
      } else {
        reject(new Error('Could not retrieve total revenue'))
      }



    })


  },
  todayRevenue: () => {

    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
      try {
        const TodayRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $match: {
              shippingStatus: 'Delivered',
              date: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$TotalAmount' },
            },
          },
        ]).toArray()

        if (TodayRevenue.length > 0) {
          console.log(TodayRevenue[0].total, "TODAY")
          resolve(TodayRevenue[0].total);
        } else {
          resolve(0)
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }

    });
  },
  weekRevenue() {

    return new Promise(async (resolve, reject) => {
      const Weeksales = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: { shippingStatus: 'Delivered', date: { $gte: new Date(new Date().getDate() - 7) } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$TotalAmount' },
          },
        },
      ]).toArray();
      if (Weeksales.length !== 0) {
        console.log(Weeksales);
        resolve(Weeksales[0].total);
      } else {
        reject();
      }
    });

  },
  yearRevenue: () => {

    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {
      const sales = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          // $match: { fullDate: { $gte: new Date(new Date().getFullYear - 1) } },
          $match: { shippingStatus: 'Delivered', date: { $gte: new Date(new Date().getFullYear() - 1) } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$TotalAmount' },
          },
        },
      ]).toArray();
      if (sales.length !== 0) {
        resolve(sales[0].total);
      } else {
        reject();
      }

    });

  },
  monthRevenue: () => {


    const currentDate = new Date();
    return new Promise(async (resolve, reject) => {

      const currentDate = new Date();
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      const monthRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: {
            shippingStatus: 'Delivered',
            date: {
              $gte: monthStart,
              $lt: monthEnd
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$TotalAmount' },
          }
        }
      ]).toArray();

      console.log(monthRevenue[0].total);

      resolve(monthRevenue[0].total)
    });

  },



  adminDashboardChart: () => {

    return new Promise(async (resolve, reject) => {

      let data = {}


      data.COD = await db.get().collection(collection.ORDER_COLLECTION).find({ PaymentMethod: 'COD' }).count()
      data.ONLINE = await db.get().collection(collection.ORDER_COLLECTION).find({ PaymentMethod: 'ONLINE' }).count()
      data.PAYPAL = await db.get().collection(collection.ORDER_COLLECTION).find({ PaymentMethod: 'Paypal' }).count()
      data.WALLET = await db.get().collection(collection.ORDER_COLLECTION).find({ PaymentMethod: 'Wallet' }).count()
      data.PENDING = await db.get().collection(collection.ORDER_COLLECTION).find({ status: 'pending' }).count()
      data.DELIVERED = await db.get().collection(collection.ORDER_COLLECTION).find({ shippingStatus: 'Delivered' }).count()
      data.CANCEL = await db.get().collection(collection.ORDER_COLLECTION).find({ status: 'order cancelled' }).count()
      data.RETURN = await db.get().collection(collection.ORDER_COLLECTION).find({ status: 'ReturnConfirmed' }).count()

      console.log(data.CANCEL);
      console.log(data.DELIVERED);
      console.log(data.PENDING);
      console.log(data.COD);
      console.log(data.ONLINE);
      console.log(data.PAYPAL, "++++++++++");
      resolve(data)





    })

  },
  allSalesReport: () => {

    return new Promise(async (resolve, reject) => {

      let salesReport = await db.get().collection(collection.ORDER_COLLECTION).aggregate([

        {
          $match: {

            shippingStatus: 'Delivered',
          }
        },
        {
          $unwind: '$products'
        },
        {
          $lookup: {
            from: 'product',
            localField: 'products.item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        }

      ]).toArray()



      resolve(salesReport)

    })
  },
  addCoupons: (CouponID) => {


    CouponID.StartDates = new Date(CouponID.StartDates)
    CouponID.EndDates = new Date(CouponID.EndDates)
    CouponID.MinimumAmounts = parseInt(CouponID.MinimumAmounts)
    CouponID.MaximumAmounts = parseInt(CouponID.MaximumAmounts)
    CouponID.Discounts = parseInt(CouponID.Discounts)
    return new Promise((resolve, reject) => {

      db.get().collection(collection.COUPON_COLLECTION).insertOne(CouponID).then((Coupons) => {

        resolve(Coupons)
      }).catch((err) => {


      })
    })
  },
  allCouponDetails: () => {

    return new Promise(async (resolve, reject) => {

      let AllCoupons = await db.get().collection(collection.COUPON_COLLECTION).find().toArray()

      resolve(AllCoupons)
    })

  },

  getAllUsersDashboard: () => {

    return new Promise(async (resolve, reject) => {

      let usersdashboard = await db.get().collection(collection.USER_COLLECTION).find().toArray()
      resolve(usersdashboard)
    })
  },
  getAllProductOffer: () => {

    return new Promise(async (resolve, reject) => {

      let ProductOffer = await db.get().collection(collection.PRODUCTOFFER_COLLECTION).find().toArray()

      console.log(ProductOffer);
      resolve(ProductOffer)
    })
  },
  getAllCategoryOffer: () => {

    return new Promise(async (resolve, reject) => {

      let CategoryOffer = await db.get().collection(collection.CATEGORYOFFER_COLLECTION).find().toArray()

      console.log(CategoryOffer);

      resolve(CategoryOffer)
    })
  },
  adminEditCoupon: (CouponID) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.COUPON_COLLECTION).findOne({ _id: ObjectId(CouponID) }).then((coupon) => {

        resolve(coupon)
      })
    })

  },
  adminEditedCoupon: (CouponID, body) => {


    body.Discounts = parseInt(body.Discounts)
    body.MinimumAmounts = parseInt(body.MinimumAmounts)
    body.MaximumAmounts = parseInt(body.MaximumAmounts)
    body.StartDates = new Date(body.StartDates)
    body.EndDates = new Date(body.EndDates)

    return new Promise((resolve, reject) => {

      db.get().collection(collection.COUPON_COLLECTION).updateOne({ _id: ObjectId(CouponID) }, {


        $set: {

          Code: body.Code,
          Name: body.Name,
          Discounts: body.Discounts,
          StartDates: body.StartDates,
          EndDates: body.EndDates,
          MinimumAmounts: body.MinimumAmounts,
          MaximumAmounts: body.MaximumAmounts
        }

      }).then((response) => {

        resolve()
      })

    })
  },
  adminDeleteCoupon: (CouponID) => {

    return new Promise((resolve, reject) => {

      db.get().collection(collection.COUPON_COLLECTION).deleteOne({ _id: ObjectId(CouponID) }).then((response) => {

        resolve(response)
      })
    })
  }

}