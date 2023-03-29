
const {doSignup,doLogin,ShowProduct,productAlldetails,getCategory,filterByCategory,AddTOCART,getAllCartProducts,changeProductQuantity,removeCartItems,getCartTotalAmount,PlaceOrdered,getproductList,OrderDetails,OrderCancelled,findByNumber,orderProductView,UserWishlist,getAllWishlist,removeWishlistItems,generateRazorpay,verifypayments,changePaymentStatus,AddAddress,getAddress,getSearchProduct,getPriceFilter,AddCheckCoupon,userEditAccount,userEditedProfile,getAllAddress,createPaypal,getCartOfferAmount,AllCouponDetails,removeCartAfterOrder,WalletAmount,changeWalletAmount}=require('../Model/user-helpers');
const {respons, response}=require('express');
const session = require('express-session');
const expressEjsLayouts = require("express-ejs-layouts");
var paypal = require('paypal-rest-sdk');
const { getWalletAmount } = require("../Model/order-helpers");
const cc= require("currency-converter-lt")
require('dotenv').config()
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authTOKEN = process.env.TWILIO_TOKEN
const serviceID = process.env.SERVICE_ID
const client = require("twilio")(accountSID,authTOKEN,serviceID);
const PaypalclientID = process.env.PAYPAL_CLIENTID
const PaypalclientSecret=process.env.PAYPAL_CLIENTSECRET
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': PaypalclientID,
    'client_secret': PaypalclientSecret
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
      
      const error = "Stock limit Exceeded";
      res.status(400).json({ error: error }); 

    })
  },
  CartPage(req,res){

   let users=req.session.users
    let products=getAllCartProducts(req.session.users._id).then((products)=>{
          
    
      
      getCartTotalAmount(req.session.users._id).then((Total)=>{
      
     

      console.log(products,"++&&&&&&&&&&&&");
      if(products.length!=0){
     

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

     }).catch(()=>{
        
      const error = "Stock limit Exceeded";
      res.status(400).json({ error: error }); // send 400 Bad Request with custom error message
     })
   
  },
  removeCartItem(req,res,next){
    console.log(req.body);
    

    removeCartItems(req.body).then((response)=>{
     
      res.json(response)

    }).catch(()=>{

      
    })
  },
  proceedToCheckout: (req, res) => {
    let users = req.session.users;
  
    getCartTotalAmount(req.session.users._id)
      .then((Total) => {
        let products = getAllCartProducts(req.session.users._id);
        let usersAddress = getAllAddress(users._id);
        let walletAmount = WalletAmount(req.session.users._id);
  
        Promise.all([products, usersAddress, walletAmount])
          .then(([products, usersAddress, walletAmount]) => {
            if (!walletAmount) {
              walletAmount = { total: 0 };
            }
  
            console.log(walletAmount.total, "tttttttttttttttttttttttttttt");
            console.log(Total, "tttttttttttttttttttttttttttt");
  
            res.render("userviews/proceedToCheckout", {
              user: true,
              users,
              Total,
              products,
              usersAddress,
              walletAmount,
            });
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/");
          });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/");
      });
  },
 async  PlaceOrder(req,res){
   
   let Total = parseInt(req.body.Total)
     console.log(Total,"+++++++++++++++++++------------");
    let finalPrice
    let TOtal = Number(req.body.Total)
    console.log(typeof TOtal)
    let currencyConverter = new cc({from:"INR", to:"USD", amount:TOtal});
          let response = await currencyConverter.convert();
          console.log("response",response); 
          var usdtotal=Math.round(response)
          console.log(usdtotal,"//usd");
    if(req.body.offerdata){

      finalPrice=req.body.offerdata
    }else{

      finalPrice =TOtal
    }
   
    let users=req.session.users
   
    getproductList(req.body.userID).then((products)=>{

      getCartTotalAmount(req.body.userID).then((Total)=>{
    
    PlaceOrdered(req.body,products,finalPrice).then((orderID)=>{
         
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
     
      if(req.body.payment_method=='COD'){

        let ids = destruct(products)
        console.log(ids,"ids");
  
        console.log(`this is the idss :: ${ids}`);
        removeCartAfterOrder(ids,req.body.userID)
        .then(()=>{
         
          res.json({codSuccess:true})

        }).catch(()=>{
          console.log("error occured while removing from cart after order");
        })
       
      
      }
    
      else if(req.body.payment_method=='ONLINE'){

        generateRazorpay(orderID,Total).then((response)=>{
            
          let ids  = destruct(products)

          removeCartAfterOrder(ids,req.body.userID).then(()=>{
            
            response.razorPay=true
            res.json(response)

          })

         

        })
      }else if(req.body.payment_method=='Paypal'){
        
        // const Total = Math.floor(finalPrice/85)
       console.log(usdtotal,"}}}}}}}}}}}}}}}}}}}}}}}}}}");
        var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "https://sneakerspot.live/order/OrderDetails",
              "cancel_url": "https://Gota.gq/paymentError"
          },
          "transactions": [{
              "amount": {
                  "currency": "USD",
                  "total":  usdtotal
              },
              "description": "this is order"
          }]
      };
    
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          console.log(error.response, 'paypal errorrr');
          throw error;
          

        } else {
          for (var index = 0; index < payment.links.length; index++) {
           console.log('paymenttttttttttttttttttttttttt');

            if (payment.links[index].rel === 'approval_url') {
             console.log('successssssssssssssssssssssssssss');
              console.log(payment.links[index]);
              // res.json({  url: payment.links[index].href,status:"payPal" });
              var forwardLink = payment.links[index].href;
        var response = { forwardLink: forwardLink };
        res.json(response); // send JSON response back to client






            //  response.paypal=true;
              // res.json({  forwardLink: payment.links[index].href ,response});
            }
          }
          // console.log(payment);
        }
      });
            changePaymentStatus(orderID).then(()=>{

              let ids = destruct(products)

              removeCartAfterOrder(ids,req.body.userID).then(()=>{

            })

          })
   
    

            
  }else if(req.body.payment_method=='Wallet'){

    let ids = destruct(products)
 
   changeWalletAmount(req.body.userID,finalPrice)
   .then(()=>{
          
    removeCartAfterOrder(ids,req.body.userID)
    .then(()=>{

      res.json({Wallet:true})

  })
  .catch(()=>{
console.log("))))))))))))))))))))");
    const error = "Sufficient balance for WalletAmount";
    res.status(400).json({ error: error }); // send 400 Bad Request with custom error message
  })
        })


      }

     

    })

      })



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
      .services(serviceID)
      .verifications.create({
        to: `+91${number}`,
        channel: 'sms',
        
      }).then(() => {
       
        res.render('userviews/OTPverification',{user:true,users});
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
    .services(serviceID)
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
  
  AddToWishlist(req,res){
   console.log(req.params.id,req.session.users._id);
     users=req.session.users
    
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
     
    getAllAddress(req.session.users._id).then((usersAddress)=>{

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
  
 
    getAllAddress(req.body.userID,req.body.username).then((userAddress)=>{
     
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

    }).catch((error)=>{

      error = 'product not found';
      res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})

    })

   },
   checkcoupon(req,res){

    AddCheckCoupon(req.body.data,req.body.Total).then((response)=>{
     
      res.json(response)

    }).catch(()=>{

      const error = "Invalid Coupon";
      res.status(400).json({ error: error })
    })
   },
   editaccount(req,res){
    
    let users=req.session.users
    userEditAccount().then((EditAccount)=>{
      
      res.render('userviews/EditAccount',{user:true,EditAccount,users})

    })
    
   },
   EditedAddress(req,res){
      
 
    userEditedProfile(req.params.id,req.body).then((updateAddress)=>{
     
    
        res.redirect('/Address')
  
      
     

    })

   },
   AllCoupons(req,res){

    let users=req.session.users
    AllCouponDetails().then((Coupons)=>{

     res.render('userviews/Coupons',{user:true,Coupons,users})

    })

   },
   Wallet(req,res){

    let users = req.session.users
    
    WalletAmount(req.session.users._id).then((walletAmount)=>{

      res.render('userviews/WalletPage',{user:true,users,walletAmount})

    })
   
   }
  
  
  
}


