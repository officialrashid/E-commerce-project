const {respons, response}=require('express');
const {UserOrderDetails,productView,adminOrderCancellled,shippingDetail,OrderDetails,OrderCancelled,orderProductView,BillingAddress,productOffer,orderReturned,orderProductList,stockIncreamentAfterReturn,orderReturnConfirm,getWalletAmount,ReturnAfterCreateWallet}=require('../Model/order-helpers')

module.exports={
    sessioncheck:(req,res,next)=>{
     
        if(req.session.users){
           
            next();
        }else{

            res.redirect('/LoginandSignupButton')
        }
    },
    loginredirect:(req,res,next)=>{

        if(!req.session.users){
      
          req.session.loggedIn=false
      
        }if(req.session.users){
          
          res.redirect('/')
        }else{
          next();
        }
      },
      nocache:(req, res, next)=>{
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
      },
      verifyLogin:(req,res,next)=>{

        if(req.session.users){
          
          next()

        }else{

          res.redirect('/LoginandSignupButton')
        }
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
    
   
    adminOrderCancellled(req.params.id,req.body.status).then((response)=>{

     
  res.redirect('/order/Orders')
        
    
})
   },
   shippingStatus(req,res,next){
    
  
    shippingDetail(req.params.id,req.body.shippingStatus).then((response)=>{
       
      res.redirect('/order/Orders')


    })  


     

   },
   UserOrderView(req,res){
    

    let users=req.session.users
    OrderDetails(req.session.users._id).then((OrderDetails)=>{
    
      res.render('userviews/UserOrderView',{user:true,OrderDetails,users})
    })
   
    

  },
  OrderCancel(req,res){

    OrderCancelled(req.params.id,req.body.status).then(()=>{

           res.redirect('/order/UserOrderView')
    })
  },
  userProductView(req,res){
       console.log(req.body);
    let users=req.session.users
      orderProductView(req.params.id).then((singleOrder)=>{

        

            BillingAddress(req.params.id).then((BillingAddress)=>{
                
              productOffer(req.params.id).then(()=>{

                console.log(BillingAddress,"billingAddress");

                res.render('userviews/orderviewProducts',{user:true,singleOrder,users,BillingAddress})

              })
             
            })
         
           

      
        })
         
      
  },
  OrderDetails(req,res){
         
    let users=req.session.users
      res.render('userviews/OrderDetails',{user:true,users})
  },

  OrderReturn(req,res){

    orderReturned(req.params.id,req.body.status).then((response)=>{
     

      res.redirect('/order/UserOrderView')

    })
  },
  adminReturnedOrder(req,res){
    
    
    orderReturnConfirm(req.params.id,req.body.status).then(()=>{

      orderProductList(req.params.id).then((products)=>{

        console.log(products,"products coming");
  
        function destruct(products) { 
          let data =[]
          for(let i=0;i<products.length;i++){
            let obj ={}  
            obj.prod= products[i].item
            obj.quantity= products[i].quantity
            data.push(obj)
          }
          return data
        }
        let ids = destruct(products)
        console.log(ids,"ids");

      stockIncreamentAfterReturn(ids).then(()=>{
  
      getWalletAmount(req.params.id).then((wallet)=>{

        ReturnAfterCreateWallet(wallet.TotalAmount,wallet.userID).then(()=>{
          
         
          res.redirect('/order/Orders')

        })
        
      
      })
       
  
      })
  
       
  
      })

      
        
    })
  }

}