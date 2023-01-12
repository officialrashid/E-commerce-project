const {doadminSignup,getAllusers,adminadd,getAllproduct,adminedit,adminEditsubmit,removeProduct,AddCategorys,getAllcategory,CategoryEdit,adminCategoryEdit,removeCategory,userblock,getAllcategorydropdown,getcategory,adminCategoryAdd,UserOrderDetails,productView,adminOrderCancellled,productListandUnlist,shippingDetail,salesReport,adminAddBanner, getAllBanners,editbanners,adminBannerEdit,TotalSales,TodayOrders,ThisWeekOrders,ThisMonthOrders,ThisYearOrders,TotalRevenues,TodayRevenue,WeekRevenue,YearRevenue,MonthRevenue,admindashboardChart,AllSalesReport,AddCoupons,AllCouponDetails,InsertProductOffer,getProductOffer,getAllusersdashboard}=require('../Model/admin-helpers')
const {respons, response}=require('express');
const { Result } = require('express-validator');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports={

    adminlogin(req,res,next){
          
        res.render('adminviews/adminlogin');
         
    },
    adminRegisterd(req,res,next){

        doadminSignup(req.body).then((adminData)=>{

          TotalSales().then((TotalSales)=>{

            TodayOrders().then((TodaySales)=>{
     
              ThisWeekOrders().then((WeekSales)=>{
      
                ThisMonthOrders().then((MonthSales)=>{
      
                  ThisYearOrders().then((YearSales)=>{

                    TotalRevenues().then((TotalRevenue)=>{

                      TodayRevenue().then((TodayRevenue)=>{

                        WeekRevenue().then((WeekRevenue)=>{

                          YearRevenue().then((YearRevenue)=>{

                           MonthRevenue().then((MonthRevenue)=>{
                             
                            admindashboardChart().then((data)=>{

                              getAllusersdashboard().then((usersdashboard)=>{

                              console.log(TotalSales);

                              console.log(adminData);
                  
                              res.render('adminviews/admindashboard',{user:false,TotalSales,TodaySales,WeekSales,MonthSales,YearSales,TotalRevenue,TodayRevenue,WeekRevenue,YearRevenue,MonthRevenue,data,usersdashboard})
                
                              }).catch((error)=>{
          
                                res.render('adminviews/adminlogin')
      
                                  })

                                })
                            })
                                     
                     

                        
                        })

                          })

                          
                       

                      })
                      
                    

                    })
           
               
      
        
                })
      
            })
      
         }) 
          
      
      })
            
          

        })
        })
    },
    AllUsers(req,res,next){
          
     getAllusers().then((users)=>{
      
        res.render('adminviews/adminAllUsers',{users,user:false})
     })
        
    },
   Stocks(req,res,next){
    
    getAllproduct().then((products)=>{
     
        res.render('adminviews/adminStocks',{user:false,products})
    })
   


   },
   AddProduct(req,res,next){
    
    getAllcategorydropdown().then((getcategorydropdown)=>{

    res.render('adminviews/AddProduct',{user:false,getcategorydropdown})
    })
    
    
   },

   AddedProduct(req,res,next){

        var image=req.files.Image
        var image1=req.files.Image1
        var image2=req.files.Image2
        var image3=req.files.Image3
        adminadd(req.body).then((data)=>{

          image.mv('./public/Product-images/'+data.id+'.jpg',(err,done)=>{

            image1.mv('./public/Product-images1/'+data.id+'.jpg',(err,done)=>{
            
              image2.mv('./public/Product-images2/'+data.id+'.jpg',(err,done)=>{
            
                image3.mv('./public/Product-images3/'+data.id+'.jpg',(err,done)=>{
                   
                  if(err){
                    console.log(err);
          
                  }else{
                    res.redirect('/admin/Stocks')
                  }
                
                })
              })
             
            })

          
          })
        }).catch((err)=>{
          console.log(err);
        })

    
   },
   editproduct(req,res){

    let productid=req.params.id
    getcategory().then((geteditcategory)=>{

   
     adminedit(productid).then((product)=>{
      
      res.render('adminviews/EditProduct',{user:false,product,geteditcategory})


    })
   
    })
   },

   editsubmit(req,res){

    let id=req.params.id
    adminEditsubmit(req.params.id,req.body).then(()=>{
       
      
          
      res.redirect('/admin/Stocks')
      
        console.log(req.file);
         if(req.files?.Image){

        var image=req.files.Image
        image.mv('./public/Product-images/'+id+'.jpg')

         }else if(req.files?.Image1){
           
          var image1=req.files.Image1
          image1.mv('./public/Product-images1/'+id+'.jpg')

         }else if(req.files?.Image2){

          var image2=req.files.Image2
          image2.mv('./public/Product-images2/'+id+'.jpg')

         }else if(req.files?.Image3){
          
          var image3=req.files.Image3
          image3.mv('./public/Product-images3/'+id+'.jpg')

         }
      
    })

   },

   deleteproduct(req,res){

    let deleteid=req.params.id
    removeProduct(deleteid).then((response)=>{

      res.redirect('/admin/Stocks')
    })
   },

   Categorypage(req,res,next){
     
    getAllcategory().then((getcategory)=>{
        

      res.render('adminviews/adminCategory',{user:false,getcategory})
    })
    
   },
   addcategory(req,res,next){

     

      res.redirect('/admin/Category')
     
   },
   AddedCategory(req,res,){
     
    AddCategorys(req.body).then((addcategory)=>{

      res.redirect('/admin/Category')
    })

   },
   EditCategory(req,res,next){
     
    let categoryid=req.params.id
    adminCategoryEdit(categoryid).then((categoryEdit)=>{

      res.render('adminviews/EditCategory',{user:false,categoryEdit})
    })
    

   },
   EditCategorySubmit(req,res,next){
      
     CategoryEdit(req.params.id,req.body).then(()=>{

      res.redirect('/admin/Category')
     })
   },

   DeleteCategory(req,res){
    
    let deleteCategoryid=req.params.id
      
    removeCategory(deleteCategoryid).then((response)=>{
      
      res.redirect('/admin/Category')
    })
    
   },
   blockmanagement(req,res){

    userblock(req.params.id,req.body.status).then(()=>{
      
      res.redirect('/admin/AllUsers')

    })
   },
   Orders(req,res){
    
    UserOrderDetails().then((UserOrder)=>{

        res.render('adminviews/UserOrders',{user:false,UserOrder})
    })

   },
   adminProductView(req,res){
     
    productView(req.params.id).then((singleOrder)=>{

        res.render('adminviews/OrderProductDetails',{singleOrder,user:false})
    })

   },
   adminCancelOrder(req,res){
    
    console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
    adminOrderCancellled(req.params.id,req.body.status).then((response)=>{

     
  res.redirect('/admin/Orders')
        
    
})
   },
   productManage(req,res){
    console.log(req.params.id,req.body.stock);

    productListandUnlist(req.params.id,req.body.stock).then((response)=>{
        
      res.redirect('/admin/Stocks')

    })
   },
   shippingStatus(req,res,next){
    
    console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}rashid");
    shippingDetail(req.params.id,req.body.shippingStatus).then((response)=>{
       
      res.redirect('/admin/Orders')


    })  


     

   },
   dashboard(req,res){

   
    TotalSales().then((TotalSales)=>{

      TodayOrders().then((TodaySales)=>{
     
        ThisWeekOrders().then((WeekSales)=>{

          ThisMonthOrders().then((MonthSales)=>{

            ThisYearOrders().then((YearSales)=>{
     
              TotalRevenues().then((TotalRevenue)=>{

                TodayRevenue().then((TodayRevenue)=>{

                  WeekRevenue().then((WeekRevenue)=>{

                    YearRevenue().then((YearRevenue)=>{

                     MonthRevenue().then((MonthRevenue)=>{
                       
                      admindashboardChart().then((data)=>{
                         
                        getAllusersdashboard().then((usersdashboard)=>{

                          console.log(TotalSales);

                          res.render('adminviews/admindashboard',{user:false,TotalSales,TodaySales,WeekSales,MonthSales,YearSales,TotalRevenue,TodayRevenue,WeekRevenue,YearRevenue,MonthRevenue,data,usersdashboard})
                        })
              
          
                        }).catch((error)=>{
    
                         console.log(error);

                            })
                      })
                               
               

                  
                  })

                    })

                    
                 

                })
                
              

              })
     
         

  
          })

            })

  
          })

      })

      }) 
     
    
   },
   AddBanner(req,res){
     
    let users=req.session.users

    getAllBanners().then((Banners)=>{

      res.render('adminviews/AddBanner',{user:false,users,Banners})
    
    })

   


   },
   AddedBanner(req,res){
    
    var image=req.files.Image
    console.log(req.body);

    console.log(req.files);
    
    adminAddBanner(req.body).then((data)=>{
      
      image.mv('./public/Banner-images/'+data.id+'.jpg',(err,done)=>{
      
        if(err){
          console.log(err);

        }else{
          res.redirect('/admin/Banner')
        }
      })
      
       
    })

   },
   editbanner(req,res){
    
    let productid=req.params.id
    editbanners(productid).then((product)=>{
      
      res.render('adminviews/EditBanner',{user:false,product})

    })
   

   },
   EditedBanner(req,res){
    
    let id=req.params.id
    console.log(id+"||||||||||||||||||||||||||||||||||||||");
    adminBannerEdit(req.params.id,req.body).then(()=>{
      
           
      res.redirect('/admin/Banner')
      
        console.log(req.file);
         if(req.files?.Image){

        var image=req.files.Image
        image.mv('./public/Banner-images/'+id+'.jpg')

         }

    })


   },
   TodayOrderList(req,res){
     
   

    TodayOrders().then((response)=>{

    console.log(response);
      // res.redirect('/admin/dashboard')
         
      res.json(response)

     })
      

   },
   Weeksales(req,res){

    ThisWeekOrders().then(()=>{
     
      res.redirect('/admin/dashboard')

    })
   },
   Monthsales(req,res){

    ThisMonthOrders().then(()=>{

      res.redirect('/admin/dashboard')
    })

   },
   Yearsales(req,res){

    ThisYearOrders().then(()=>{
     
      res.redirect('/admin/dashboard')
      
    })
   },
   TotalRevenue(req,res){
    
    TotalRevenues().then((TotalRevenue)=>{

      res.redirect('/admin/adminLoged')
    })

   },
   SalesReport(req,res){
    
    AllSalesReport().then((salesReport)=>{

     
      res.render('adminviews/SalesReport',{user:false,salesReport})

    })
  

   },
   AddCoupon(req,res){

    res.render('adminviews/AddCoupon',{user:false})
   },
   AddedCoupon(req,res){

    AddCoupons(req.body).then((Coupon)=>{
         
      AllCouponDetails().then((Coupons)=>{
      
       
            
    
       res.render('adminviews/Coupons',{user:false,Coupons})

      })
    })
   },
   AllCoupons(req,res){

    AllCouponDetails().then((Coupons)=>{
      
      res.render('adminviews/Coupons',{user:false,Coupons})
          
    })
   },
   AllOffers(req,res){
    
    res.render('adminviews/Offers',{user:false})

   },
   ProductOffer(req,res){
    
    getAllproduct().then((products)=>{
        
      res.render('adminviews/ProductOffers',{user:false,products})

    })
   },
   AddProductOffer(req,res){

    console.log(req.body);
   
    InsertProductOffer(req.body).then(()=>{
        
      getProductOffer(req.body).then(()=>{

        res.redirect('/admin/AllOffers')
      })

         
    })



   },
   CategoryOffer(req,res){
       
    let users = req.session.users
    res.render('adminviews/CategoryOffer',{user:true,users})
   }
}