const {doadminSignup,getAllusers,removeProduct,userblock,adminAddBanner, getAllBanners,editbanners,adminBannerEdit,TotalSales,TodayOrders,ThisWeekOrders,ThisMonthOrders,ThisYearOrders,TotalRevenues,TodayRevenue,WeekRevenue,YearRevenue,MonthRevenue,admindashboardChart,AllSalesReport,AddCoupons,AllCouponDetails,getAllusersdashboard,getAllProductOffer,getAllCategoryOffer,adminEditCoupon,adminEditedCoupon,adminDeleteCoupon}=require('../Model/admin-helpers')
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
   
  

   
   

   

   deleteproduct(req,res){

    let deleteid=req.params.id
    removeProduct(deleteid).then((response)=>{

      res.redirect('/admin/Stocks')
    })
   },

   
   
   
  
  

  
   blockmanagement(req,res){

    userblock(req.params.id,req.body.status).then(()=>{
      
      res.redirect('/admin/AllUsers')

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
       
    
    AddCoupons(req.body).then(()=>{
         
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
    
    getAllProductOffer().then((ProductOffer)=>{

    res.render('adminviews/Offers',{user:false,ProductOffer})

  })
   },
   
  
   CategoryOffer(req,res){
       
    let users = req.session.users
    res.render('adminviews/CategoryOffer',{user:true,users})
   },
   ShowProductOffer(req,res){

    getAllProductOffer().then((ProductOffer)=>{
  
      
      res.render('adminviews/Offers',{user:false,ProductOffer})
  
  
    })
  },
  ShowCategoryOffer(req,res){

    getAllCategoryOffer().then((CategoryOffer)=>{

      res.render('adminviews/ShowCategoryOffer',{user:false,CategoryOffer})

    })
  },
  editCoupon(req,res){

    adminEditCoupon(req.params.id).then((coupon)=>{
    
      res.render('adminviews/EditCoupon',{user:false,coupon})

    })
  },
  EditedCoupon(req,res){

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