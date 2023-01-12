const client = require("twilio")('AC93740ac41b5fb2ca6ab35e9e3fa6011e','5cb6c4c7e4043572859d57548594cdac');
const {doSignup,doLogin,ShowProduct,productAlldetails,getCategory,filterByCategory,AddTOCART,getAllCartProducts,changeProductQuantity,removeCartItems,getCartTotalAmount,PlaceOrdered,getproductList,OrderDetails,OrderCancelled,findByNumber,orderProductView,UserWishlist,getAllWishlist,removeWishlistItems,generateRazorpay,verifypayments,changePaymentStatus,AddAddress,getAddress,getSearchProduct,getPriceFilter,AddCheckCoupon,userEditAccount,userEditedProfile,getAllAddress,createPaypal}=require('../Model/user-helpers');
const {respons}=require('express');
const session = require('express-session');
const expressEjsLayouts = require("express-ejs-layouts");
var paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdWT8KrxryyacVPyNjgDJYb-nR_JfTEpLuFyC6NtC0DJTOkWeD9XP8AfLOKFap2TRQynPH9aUstAQh_i',
    'client_secret': 'EHXNfgg6vFtraHdVOFTPdk0AvDcxJi2ObHyLB5W3wgc8eBpuzaCPDgMQySkTJ9XLNm8Fn3bkYE9qHu3g'
  });
let otpusers
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

    userlandingpage(req,res,next){
    
    let users=req.session.users
     ShowProduct().then((ShowProducts)=>{

      getCategory().then((getCategoryData)=>{


        res.render('userviews/landingpage',{user:true,ShowProducts,users,getCategoryData});
      })
    
            
        
     })
    
},
userLoged(req,res){
    doLogin(req.body).then((user)=>{
       console.log(user);
        
       req.session.loggedIn=true;
       req.session.users=user
       
  
          res.redirect('/');
  
       }).catch((error)=>{
        console.log(error);
        res.render('userviews/userlogin and signup',{error:`${error.error}`})
       })
    
},

userRegistered(req,res,next){
    doSignup(req.body).then((userdata)=>{
           console.log(userdata);
           req.session.loggedIn=true;
           req.session.users=userdata
        res.redirect('/');

    }).catch((error)=>{

        res.render('userviews/userlogin and signup',{error:`${error.error}`})
    })
   

},
LoginandSignupButton(req,res,next){

    res.render('userviews/userlogin and signup');
},

productDetails(req,res,next){
    let users=req.session.users
    productAlldetails(req.params.id).then((DetailProduct)=>{
      
      res.render('userviews/productDetails',{user:true,DetailProduct,users})
    }).catch(()=>{

    })
},

Logout(req,res){
    
    req.session.loggedIn=false;
    req.session.users=null;
    res.redirect('/')
},

// AddtoCart(req,res){
  
//   users=req.session.users
  
//   productAlldetails(req.params.id).then((DetailProduct)=>{
      
//     res.render('userviews/productDetails',{user:true,DetailProduct,users})
//   })
 
 
// },


ShopButton(req,res){
   
  users=req.session.users
  console.log(users);

  ShowProduct().then((ShowProducts)=>{
  
  getCategory().then((getCategoryData)=>{
   
    getPriceFilter(req.body.minprice,req.body.maxprice).then((priceFilter)=>{

      res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData,priceFilter})

    })

   
  }).catch(()=>{

  })


    
  }).catch(()=>{

  })

  },

  categoryfilter(req,res){

    let users=req.session.user
    let name=req.body;

    console.log(users);
    console.log(name);

    filterByCategory(name).then((ShowProducts)=>{
     
      getCategory().then((getCategoryData)=>{
      
        res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})


      }).catch(()=>{

        res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})
      })
     
    })
  },
  AddtoCart(req,res){
     
    users=req.session.users
    AddTOCART(req.params.id,req.session.users._id).then(()=>{

       res.json({status:true})
    }).catch(()=>{

    })
  },
  CartPage(req,res){

   let users=req.session.users
    let products=getAllCartProducts(req.session.users._id).then((products)=>{
          
      console.log("}}}}}}}}}}}}}}}}}}}}}}}}}");
      
      getCartTotalAmount(req.session.users._id).then((Total)=>{
      console.log(products);
      if(products.length!=0){
        console.log(products,"{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}");

        res.render('userviews/CartPage',{user:true,products,users,Total})
      }else{
         
        res.render('userviews/cartEmpty',{user:true,users})
        
      }
      

      
    }).catch(()=>{

    })  

    }).catch(()=>{

    })
  },
  changequantity(req,res,next){

          console.log(req.body);
          
     changeProductQuantity(req.body).then((response)=>{
      
      // response.Total=getCartTotalAmount(req.body.users).then(()=>{
       res.json(response)
      //  res.redirect('/CartPage')
    // })
     }).catch(()=>{

     })
  },
  removeCartItem(req,res,next){
    console.log(req.body);
    

    removeCartItems(req.body).then((response)=>{
     
      res.json(response)

    }).catch(()=>{

      
    })
  },
  proceedToCheckout:(req,res)=>{

    let users=req.session.users;

      getCartTotalAmount(req.session.users._id).then((Total)=>{
           

        let products=getAllCartProducts(req.session.users._id).then((products)=>{
        res.render('userviews/proceedToCheckout',{user:true,users,Total,products})
        
      })
        }).catch((error)=>{
         

        })
   
    

  },
  PlaceOrder(req,res){
   
   let Total = parseInt(req.body.Total)
     console.log(Total,"+++++++++++++++++++------------");
    let finalPrice
    let TOtal =req.body.Total
    if(req.body.offerdata){

      finalPrice=req.body.offerdata
    }else{

      finalPrice =TOtal
    }
    console.log("**************************************************************");
    let users=req.session.users
    console.log(req.body);
    getproductList(req.body.userID).then((products)=>{

      getCartTotalAmount(req.body.userID).then((Total)=>{
    
    PlaceOrdered(req.body,products,finalPrice).then((orderID)=>{
         
      if(req.body.payment_method=='COD'){

        res.json({codSuccess:true})
      }else if(req.body.payment_method=='ONLINE'){

        generateRazorpay(orderID,Total).then((response)=>{
        
          response.razorPay=true
          res.json(response)

        })
      }else if(req.body.payment_method=='Paypal'){
        
        var payment = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "https://Gota.gq/orderSucess",
              "cancel_url": "https://Gota.gq/paymentError"
          },
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total": "100"
              },
              "description": "this is order"
          }]
      };
      createPaypal(payment).then((transaction)=>{
        var id = transaction.id;
        var links = transaction.links;
        var counter = links.length;
    while(counter--){
        if(links[counter].rel=='approval_url'){
            transaction.payPal = true
            transaction.linkto = links[counter].href
            transaction.orderId = orderID
            // userHelper.changePaymentStatus(orderId).then(()=>{
                res.json(transaction)
            // })
        }
    }
})
       
           
      }

     

    })

      })



    })
  
  },
  OrderDetails(req,res){
         
    let users=req.session.users
      res.render('userviews/OrderDetails',{user:true,users})
  },
  UserOrderView(req,res){
    

    let users=req.session.users
    OrderDetails(req.session.users._id).then((OrderDetails)=>{

      res.render('userviews/UserOrderView',{user:true,OrderDetails,users})
    })
   
    

  },
  OrderCancel(req,res){

    OrderCancelled(req.params.id,req.body.status).then(()=>{

           res.redirect('/UserOrderView')
    })
  },
  OTPlogin(req,res){
   
   let users=req.session.users
    res.render('userviews/OTPLOGIN',{user:true,users})
  },
  OTPVerify(req,res){
        
    console.log(req.body);
   let users=req.session.users
    console.log(req.body);
    
    // res.render('userviews/OTPverification',{user:true,users})

    number = req.body.PhoneNumber;
 
  // accound finding
  console.log(number);
  findByNumber(number).then((user) => {
     console.log(user);
    otpusers=user
    
    client.verify
      .services('VA2fa9b58129340937b9c615bf3243f871')
      .verifications.create({
        to: `+91${number}`,
        channel: 'sms',
        
      }).then(() => {
       
        res.render('userviews/OTPverification');
      })
      .catch((err) => {
        console.log(err);
      });
  })
    .catch((err) => {
      console.log(err);
      res.render('userviews/OTPLOGIN');
    });
  },
  SuccessOtpverify(req,res){

    client.verify
    .services('VA2fa9b58129340937b9c615bf3243f871')
    .verificationChecks.create({
      to: `+91${number}`,
      code: req.body.otplogin,
    }).then(async (data) => {
      if (data.status === 'approved') {
           req.session.loggedIn=true
          req.session.users=otpusers
          res.redirect('/')
      } else {
        console.log('OTP not matched');
        res.render('userviews/OTPverification');
      }
    })
  },
  userProductView(req,res){
       
    let users=req.session.users
      orderProductView(req.params.id).then((singleOrder)=>{

          res.render('userviews/orderviewProducts',{user:true,singleOrder,users})
      })
  },
  AddToWishlist(req,res){
   console.log(req.params.id,req.session.users._id);
     users=req.session.users
    console.log("{{{{{");
    UserWishlist(req.params.id,req.session.users._id).then((response)=>{

      res.json({status:true})

    }).catch(()=>{


    })

  },
  WishlistPage(req,res){
     
    let users=req.session.users

    getAllWishlist(req.session.users._id).then((products)=>{
        
      res.render('userviews/wishlist',{user:true,products,users})

    })

  },
  removeWishlistItem(req,res){
    
    console.log(req.body);

    removeWishlistItems(req.body).then((response)=>{

         res.json(response)

    }).catch(()=>{


    })
       
  },
  verifypayment(req,res){
 
   console.log(req.body);

   verifypayments(req.body).then(()=>{
  
    changePaymentStatus(req.body['order[receipt]']).then(()=>{
      
      console.log("payment successfully");

      res.json({status:true})

    })
    
   }).catch((err)=>{
    
    res.json({status:false})

   })

  },
  Address(req,res){
   
    let users=req.session.users
    console.log(req.params.id);
    console.log(users);
     
    getAllAddress(users._id).then((usersAddress)=>{

      res.render('userviews/UserProfile',{user:true,users,usersAddress})

    })
      

   
      
    
    
   },

   addaccount(req,res){
    let users=req.session.users
    console.log(users);
    res.render('userviews/AddAddress',{user:true,users})
   },
   AddedAddress(req,res){
     
    let users=req.session.users
    console.log(req.body);
    AddAddress(req.body).then((addressID)=>{
      
      res.redirect('/Address')

    })
   },
   getAddAddress(req,res){
    let users = req.session.users
    console.log(req.params.id);
    getAllAddress(req.params.id).then((userAddress)=>{
     
      res.json(userAddress)

    })
   },

   search(req,res){
     console.log(req.body.searchValue);
    getSearchProduct(req.body.searchValue).then((data)=>{
       
      res.json(data)

         
    })

   },
   priceFilter(req,res){
   
    users=req.session.users
    console.log(req.body);
  
    getPriceFilter(req.body.minprice,req.body.maxprice).then((ShowProducts)=>{

      getCategory().then((getCategoryData)=>{

      res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})

    })

    })

   },
   checkcoupon(req,res){

    AddCheckCoupon(req.body.data,req.body.Total).then((response)=>{
       console.log(response,"88888888888888888888888888");
      res.json(response)

    })
   },
   editaccount(req,res){
    
    let users=req.session.users
    userEditAccount().then((EditAccount)=>{
      
      res.render('userviews/EditAccount',{user:true,EditAccount,users})

    })
    
   },
   EditedAddress(req,res){
      
    console.log(req.params.id,"gdhfdhfvdghfvghvgh");
    console.log(req.body,"gggg");
    userEditedProfile(req.params.id,req.body).then((updateAddress)=>{
     
    
        res.redirect('/Address')
  
      
     

    })

   }
  
  
  
}


