var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');
const { shippingStatus } = require('../Controller/admin_controller');
const { promiseImpl } = require('ejs');

// const { adminresponse } = require('../app');

module.exports={
    //   admin login check
    doadminSignup:(adminData)=>{
       
        // return new Promise(async(resolve,reject)=>{
           
        //     adminData.password=await bcrypt.hash(adminData.password,10)
            
        //     db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData)
          
        //     resolve(adminData)
           
        // })

        return new Promise(async(resolve,reject)=>{
  
            let loginStatus=false;
            let adminresponse={}

            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})

            if(admin){

                await bcrypt.compare(adminData.password,admin.password).then((adminDataStatus)=>{

                    if(adminDataStatus){

                         adminresponse.admin=admin
                         adminresponse.adminDataStatus=true
                         resolve(adminresponse)
                    }else{

                        reject({error:"Incorrect password"})
                    }

                })
            }else{
                reject({error:"Incorrect username"})
            }
        })
        // admin log check end
    },

    // getAll users
    getAllusers:()=>{

        return new Promise(async(resolve,reject)=>{
        
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)

        })
        // getAll users End
    },

  adminadd(product){
        
          productstock=true
        return new Promise(async(resolve,reject)=>{
            var item=await db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product)
            let data={
                id:item.insertedId
            }
            if(item){
                resolve(data)
            }else{
                reject()
            }
        }).catch((err)=>{
            console.log(err);
        })
    },

    getAllproduct:()=>{

        return new Promise(async(resolve,reject)=>{
           
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)

        })
    },
    adminedit:(productid)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productid)}).then((product)=>{

                resolve(product)
            })
        })
    },
    adminEditsubmit:(editid,body)=>{
     
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectId(editid)},{

                $set:{
                    shoename:body.shoename,
                    companyname:body.companyname,
                    size:body.size,
                    color:body.color,
                    description:body.description,
                    category:body.category,
                    Image:body.Image,
                    Image1:body.Image1,
                    Image2:body.Image2,
                    Image3:body.Image3,
                    dateofmanufacture:body.dateofmanufacture,
                    price:body.price
                    


                },
                
            }).then((response)=>{

                resolve()
            })
        })
    },

    removeProduct:(deleteid)=>{

        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(deleteid)}).then((response)=>{

                resolve(response)

            })
        })
    },
    AddCategorys:(addcategory)=>{
    
    return new Promise(async(resolve,reject)=>{
     
 db.get().collection(collection.CATEGORY_COLLECTION).insertOne(addcategory).then((addcategory)=>{

        resolve(addcategory)
    })

    })
       

    },
    getAllcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(getcategory)
        })
    },
    adminCategoryEdit:(categoryid)=>{
      
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectId(categoryid)}).then((categoryEdit)=>{

                resolve(categoryEdit)
            })
        })
    
    },
    CategoryEdit:(EditCategoryId,catID)=>{
       
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.CATEGORY_COLLECTION)
            .updateOne({_id:ObjectId(EditCategoryId)},{

                $set:{
                    
                    name:catID.name
                    


                }
            }).then((response)=>{

                resolve()
            })
        })

    },
    removeCategory:(deleteCategoryid)=>{
      
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:ObjectId(deleteCategoryid)}).then((response)=>{

                resolve(response)

            })
        })

    },
    userblock:(userId,status)=>{
         
        if(status=='true'){

            status=false
        }else{
            status=true
        }
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{

                $set:{
        
                    isBlocked:status

                }
            }).then((response)=>{
                  
                console.log(response);
                resolve(response)
            })
        })
    },
    getAllcategorydropdown:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategorydropdown=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            console.log(getcategorydropdown);
            resolve(getcategorydropdown)

        })
    },
    getcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let geteditcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            console.log(geteditcategory);
            resolve(geteditcategory)
        })
    },
    UserOrderDetails:()=>{

        return new Promise(async(resolve,reject)=>{
               
            let UserOrder= await db.get().collection(collection.ORDER_COLLECTION).find().sort({date:-1}).toArray()

            resolve(UserOrder)
        })
    },
    productView:(orderID)=>{
        
        
        return new Promise(async(resolve,reject)=>{
           
          let singleOrder= await db.get().collection(collection.ORDER_COLLECTION).aggregate([

            {
                $match: {_id:ObjectId(orderID)},
            },
            {
                $project:{

                    products:1,
                    deliveryDetails:1,
                },
            },
            {
                $unwind:'$products',
            },
            {
                $lookup:{

                    from:'product',
                    localField:'products.item',
                    foreignField:'_id',
                    as:'orders',
                },
            },
            {
               $unwind:'$orders',
            },
            {
                $project:{'orders':1,_id:0}
            }

          ]).toArray();
          
          console.log(singleOrder);
          resolve(singleOrder)
        })

    },
    adminOrderCancellled:(orderID,status)=>{
       
        if(status=='placed'|| status=='pending'){
           console.log("+++++++++++++++++++++++++++++++++++");
            status='order cancelled'
         }
         return new Promise((resolve,reject)=>{
          
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{

                $set:{
    
                    status:status
                   
                }
             }).then((response)=>{
                  console.log(response);
                  console.log("}}}}}}}}}}}}}}}}}}}}}}>>>>>>>>>>>>>>>>>>>>>>");
                  resolve(response)
             })

         })

    },
    productListandUnlist:(proID,stock)=>{
       console.log(proID,stock);
        if(stock=='true'){

            stock=false
        }else{

            stock=true
        }
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proID)},{
              
                $set:{

                    productstock:stock
                }

            }).then((response)=>{

              console.log(response);
              resolve(response)
            })


        })
    },
    shippingDetail:(orderID,shippingStatus)=>{
        
        console.log(orderID,shippingStatus);

        if(shippingStatus=='Ordered'|| shippingStatus=='Shipped' || shippingStatus=='Arraving' ||  shippingStatus=='Delivered' ){
            console.log("+++++++++++++++++++++++++++++++++++");
            shippingStatus=shippingStatus
          }
          return new Promise((resolve,reject)=>{
           
             db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{
 
                 $set:{
     
                    shippingStatus :shippingStatus
                    
                 }
              }).then((response)=>{
                   console.log(response);
                   console.log("}}}}}}}}}}}}}}}}}}}}}}>>>>>>>>>>>>>>>>>>>>>>");
                   resolve(response)
              })
 
          })
 
    },
    adminAddBanner:(BannerID)=>{
     
        return new Promise(async(resolve,reject)=>{
            var banner=await db.get().collection(collection.BANNER_COLLECTION).insertOne(BannerID)
            let data={
                id:banner.insertedId
            }
            if(banner){
                resolve(data)
            }else{
                reject()
            }
        }).catch((err)=>{
            console.log(err);
        })

    },
    getAllBanners:()=>{

        return new Promise(async(resolve,reject)=>{

           let Banners=await db.get().collection(collection.BANNER_COLLECTION).find().toArray()

            resolve(Banners)
        })
    },
    editbanners:(productID)=>{

    return new Promise((resolve,reject)=>{

     db.get().collection(collection.BANNER_COLLECTION).findOne({_id:ObjectId(productID)}).then((product)=>{

        resolve(product)
     })

    })

    },
    adminBannerEdit:(editid,body)=>{
     
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.BANNER_COLLECTION)
            .updateOne({_id:ObjectId(editid)},{

                $set:{
                   
                   
                Image:body.Image,
                
                },
                
            }).then((response)=>{

                resolve()
            })

        })

        
    },
    TotalSales:()=>{

        return new Promise(async(resolve,reject)=>{

            let TotalSales=await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                { $group: { _id: null, count: { $sum: 1 } } }

            ]).toArray()
            
            resolve(TotalSales[0].count)

        })
    },
    TodayOrders:()=>{
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
               console.log(order,"todayorder");
               if (order.length > 0) {
                resolve(order[0].count);
               }else{
                resolve(0);
               }
              }catch (error) {
                console.error(error);
                reject(error);
              }
              
        });
      },
      ThisWeekOrders:()=>{
        
        return new Promise(async (resolve, reject) => {
            const Weekorders = await db.get().collection(collection.ORDER_COLLECTION)
              .find({
                $and: [
                  { date: { $lte: new Date() } },
                  { date: { $gte: new Date(new Date().getDate() - 7) } },
               
                ],
              }).toArray();
              const count = Object.values(Weekorders).length;
              console.log(count,"Weekorder");
            resolve(count);
          });
      },
      ThisMonthOrders:()=>{
       
        return new Promise(async (resolve, reject) => {
            const Monthorders = await db.get().collection(collection.ORDER_COLLECTION)
              .find({
                $and: [
                  { date: { $lte: new Date() } },
                  { date: { $gte: new Date(new Date().getDate() - 30) } },
               
                ],
              }).toArray();
              const count = Object.values(Monthorders).length;
              console.log(count,"Monthorders");
            resolve(count);
          });
       

      },
      ThisYearOrders:()=>{
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            const currentDate = new Date();
            const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);
            
            const yearOrderCount = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
              {
                $match: {
                  date: {
                    $gte: new Date(currentDate.getFullYear(),  -365),
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
      TotalRevenues:()=>{
       
        return new Promise(async(resolve,reject)=>{
        
            
            let Result=await db.get().collection(collection.ORDER_COLLECTION).aggregate([

              { $match: {shippingStatus:'Delivered'} },
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
      TodayRevenue:()=>{

        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            try {
                const TodayRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                  {
                    $match: {
                      shippingStatus:'Delivered',
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
                ]).toArray();
               console.log(TodayRevenue,"todayorder");
               if (TodayRevenue.length > 0) {
                resolve(TodayRevenue[0].total);
               }else{
                resolve(0);
               }
              }catch (error) {
                console.error(error);
                reject(error);
              }
              
        });
      },
      WeekRevenue(){
        
        return new Promise(async (resolve, reject) => {
            const Weeksales = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
              {
                $match: { shippingStatus:'Delivered',date: { $gte: new Date(new Date().getDate() - 7) } },
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
      YearRevenue:()=>{
        
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            const currentDate = new Date();
            const nextYear = new Date(currentDate.getFullYear() + 1, 0, 1);
            
            const YearRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
              {
                $match: {
                  shippingStatus:'Delivered',
                  date: {
                    $gte: new Date(currentDate.getFullYear(),  -365),
                    $lt: nextYear
                  }
                }
              },
              {
                $group: {
                    _id: null,
                    total: { $sum: '$TotalAmount' },
                  },
              }
            ]).toArray();
            
            console.log(YearRevenue);
            resolve(YearRevenue[0].total)
            
        });

      },
      MonthRevenue:()=>{
           
        const currentDate = new Date();
        return new Promise(async (resolve, reject) => {
            
            const currentDate = new Date();
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

const monthRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
  {
    $match: {
      shippingStatus:'Delivered',
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
      admindashboardChart:()=>{

          return new Promise(async(resolve,reject)=>{
            
           let data={}
                

           data.COD= await db.get().collection(collection.ORDER_COLLECTION).find({PaymentMethod:'COD'}).count()
           data.ONLINE= await db.get().collection(collection.ORDER_COLLECTION).find({PaymentMethod:'ONLINE'}).count()
           data.PENDING= await db.get().collection(collection.ORDER_COLLECTION).find({status:'pending'}).count()
           data.DELIVERED= await db.get().collection(collection.ORDER_COLLECTION).find({shippingStatus:'Delivered'}).count()
           data.CANCEL= await db.get().collection(collection.ORDER_COLLECTION).find({status:'order cancelled'}).count()

           console.log(data.CANCEL);
           console.log(data.DELIVERED);
           console.log(data.PENDING);
           console.log(data.COD);
           console.log(data.ONLINE);
           resolve(data)
              
             
             
           
           
          })

      },
      AllSalesReport:()=>{

        return new Promise(async(resolve,reject)=>{

        let salesReport= await db.get().collection(collection.ORDER_COLLECTION).aggregate([

          {
            $match:{

              shippingStatus:'Delivered',
            }
          },
          {
            $unwind:'$products'
          },
          {
            $lookup:{
              from:'product',
              localField:'products.item',
              foreignField:'_id',
              as:'product'
            }
          },
          {
            $unwind:'$product'
          }
        
        ]).toArray()
         
        
        console.log(salesReport,"iiiiiiiiiiiiiiiiiiiiii");
        resolve(salesReport)

        })
      },
      AddCoupons:(CouponID)=>{
          
        CouponID.StartDate = new Date(CouponID.StartDate)
        CouponID.EndDate = new Date(CouponID.EndDate)
        CouponID.MinimumAmount = parseInt(CouponID.MinimumAmount)
        CouponID.MaximumAmount = parseInt(CouponID.MaximumAmount)
        CouponID.Discount = parseInt(CouponID.Discount)
        return new Promise((resolve,reject)=>{

          db.get().collection(collection.COUPON_COLLECTION).insertOne(CouponID).then((Coupons)=>{

             resolve(Coupons)
          })
        })
      },
      AllCouponDetails:()=>{
        
        return new Promise(async(resolve,reject)=>{

          let AllCoupons= await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
             resolve(AllCoupons)
        })
      
      },
      InsertProductOffer:(OfferID)=>{
       
        OfferID.EndDate = new Date(OfferID.EndDate)
        OfferID.Discount = parseInt(OfferID.Discount)
        OfferID.Total =parseInt(OfferID.Total)
        console.log(OfferID.proID,"qqqqqqqqqqqqqqqqqqqqqqqrdtfgvb");
        return new Promise((resolve,reject)=>{

          db.get().collection(collection.PRODUCTOFFER_COLLECTION).insertOne(OfferID).then((proOffers)=>{

            resolve(proOffers)
          })
        })
      },
      getProductOffer:(OfferID)=>{
        
       let Total = parseInt(OfferID.price)
        console.log(OfferID,"hhhhhhhhhhhhhhhhhhhhhhh");
        console.log(Total,"kkkkkkkkkkkkkkkkkkkkkkkkkkk");
        let proID = OfferID.proID
       
        return new Promise(async(resolve,reject)=>{
          console.log("sahbdasdbvdbdvdghdhbjhdghdvvghsdvgvhgghdfsgdgsdgdfgsdfgsdfsgdgfgsdgasdg");
          const offer = await db.get().collection(collection.PRODUCTOFFER_COLLECTION).aggregate([
              {
                  $match: {
                    $and: [
                      { proID: proID },
                      { EndDate : { $gte: new Date() } },
                    
                    ]
                  }
                },
                {
                  $project: {
                    _id: null,
                    offerAmount: {
                      $subtract: [
                          Total,
                        {
                          $divide: [
                            { $multiply: [Total, "$Discount"] },
                            100
                          ]
                        }
                      ]
                    }
                  }
                }
            
          ]).toArray()

          console.log(offer,">>>>>>>>>>>>>>>>>>>>>");
          db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proID)},{

            $set:{
              offerAmount:offer[0].offerAmount
            }
          })
          if(offer.length !=0){
              resolve(offer[0]?.offerAmount)
            }else{
              reject()
            }
       
          
        }).catch((err)=>{
             
          
        })

      },
      getAllusersdashboard:()=>{

        return new Promise(async(resolve,reject)=>{

          let usersdashboard= await db.get().collection(collection.USER_COLLECTION).find().toArray()
          resolve(usersdashboard)
        })
      }
}