const {doAdminSignup,getAllUsers,removeProduct,userBlock,adminAddBanner, getAllBanners,editBanners,adminBannerEdit,totalSales,todayOrders,thisWeekOrders,thisMonthOrders,thisYearOrders,totalRevenues,todayRevenue,weekRevenue,yearRevenue,monthRevenue,adminDashboardChart,allSalesReport,addCoupons,allCouponDetails,getAllUsersDashboard,getAllProductOffer,getAllCategoryOffer,adminEditCoupon,adminEditedCoupon,adminDeleteCoupon}=require('../Model/admin-helpers')

const {respons, response}=require('express');

const { Result } = require('express-validator');

const multer  = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports={

    adminLogin(req,res,next){
          
        res.render('adminviews/adminlogin');
         
    },
    adminRegisterd(req,res,next){

      doAdminSignup(req.body).then((adminData)=>{

        totalSales().then((TotalSales)=>{

          todayOrders().then((TodaySales)=>{
     
            thisWeekOrders().then((WeekSales)=>{
      
              thisMonthOrders().then((MonthSales)=>{
      
                thisYearOrders().then((YearSales)=>{

                  totalRevenues().then((TotalRevenue)=>{

                    todayRevenue().then((TodayRevenue)=>{

                      weekRevenue().then((WeekRevenue)=>{

                        yearRevenue().then((YearRevenue)=>{

                          monthRevenue().then((MonthRevenue)=>{
                             
                            adminDashboardChart().then((data)=>{

                              getAllUsersDashboard().then((usersdashboard)=>{

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
    allUsers(req,res,next){
          
      getAllUsers().then((users)=>{
      
        res.render('adminviews/adminAllUsers',{users,user:false})
     })
        
    },
   
  

   
   

   

   deleteProduct(req,res){

    let deleteid=req.params.id
    removeProduct(deleteid).then((response)=>{

      res.redirect('/admin/Stocks')
    })
   },

   
   
   
  
  

  
   blockManagement(req,res){

    userBlock(req.params.id,req.body.status).then(()=>{
      
      res.redirect('/admin/AllUsers')

    })
   },
  
   
   
  
   
   dashboard(req,res){

   
    totalSales().then((TotalSales)=>{

      todayOrders().then((TodaySales)=>{
     
        thisWeekOrders().then((WeekSales)=>{

          thisMonthOrders().then((MonthSales)=>{

            thisYearOrders().then((YearSales)=>{
     
              totalRevenues().then((TotalRevenue)=>{

                todayRevenue().then((TodayRevenue)=>{

                  weekRevenue().then((WeekRevenue)=>{

                    yearRevenue().then((YearRevenue)=>{

                     monthRevenue().then((MonthRevenue)=>{
                       
                      adminDashboardChart().then((data)=>{
                         
                        getAllUsersDashboard().then((usersdashboard)=>{

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
   addBanner(req,res){
     
    let users=req.session.users

    getAllBanners().then((Banners)=>{

      res.render('adminviews/AddBanner',{user:false,users,Banners})
    
    })

   


   },
   addedBanner(req,res){
    
    var image=req.files.Image
    console.log(req.body,"++++++++++++++++++++++++++++");

    console.log(req.files,"}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
    
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
   editBanner(req,res){
    
    let productid=req.params.id
    editBanners(productid).then((product)=>{
      
      res.render('adminviews/EditBanner',{user:false,product})

    })
   

   },
   editedBanner(req,res){
    
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
   todayOrderList(req,res){
     
   

    todayOrders().then((response)=>{

    console.log(response);
      // res.redirect('/admin/dashboard')
         
      res.json(response)

     })
      

   },
   weekSales(req,res){

    thisWeekOrders().then(()=>{
     
      res.redirect('/admin/dashboard')

    })
   },
   monthSales(req,res){

    thisMonthOrders().then(()=>{

      res.redirect('/admin/dashboard')
    })

   },
   yearSales(req,res){

    thisYearOrders().then(()=>{
     
      res.redirect('/admin/dashboard')
      
    })
   },
   totalRevenue(req,res){
    
    totalRevenues().then((TotalRevenue)=>{

      res.redirect('/admin/adminLoged')
    })

   },
   salesReport(req,res){
    
    allSalesReport().then((salesReport)=>{

     
      res.render('adminviews/SalesReport',{user:false,salesReport})

    })
  

   },
   addCoupon(req,res){

    res.render('adminviews/AddCoupon',{user:false})
   },
   addedCoupon(req,res){
       
    
    addCoupons(req.body).then(()=>{
         
      allCouponDetails().then((Coupons)=>{
      
       
            
    
       res.render('adminviews/Coupons',{user:false,Coupons})

      })
    })
   },
   allCoupons(req,res){

    allCouponDetails().then((Coupons)=>{
      
      res.render('adminviews/Coupons',{user:false,Coupons})
          
    })
   },
   allOffers(req,res){
    
    getAllProductOffer().then((ProductOffer)=>{

    res.render('adminviews/Offers',{user:false,ProductOffer})

  })
   },
   
  
   categoryOffer(req,res){
       
    let users = req.session.users
    res.render('adminviews/CategoryOffer',{user:true,users})
   },
   showProductOffer(req,res){

    getAllProductOffer().then((ProductOffer)=>{
  
      
      res.render('adminviews/Offers',{user:false,ProductOffer})
  
  
    })
  },
  showCategoryOffer(req,res){

    getAllCategoryOffer().then((CategoryOffer)=>{

      res.render('adminviews/ShowCategoryOffer',{user:false,CategoryOffer})

    })
  },
  editCoupon(req,res){

    adminEditCoupon(req.params.id).then((coupon)=>{
    
      res.render('adminviews/EditCoupon',{user:false,coupon})

    })
  },
  editedCoupon(req,res){

    adminEditedCoupon(req.params.id,req.body).then(()=>{

      res.redirect('/admin/AllCoupons')
    })
  },
  deleteCoupon(req,res){

    adminDeleteCoupon(req.params.id).then((response)=>{
     
      res.redirect('/admin/AllCoupons')

    })
  }
}