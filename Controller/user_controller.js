
const { doSignup, doLogin, showProduct, productAllDetails, getCategory, filterByCategory, addToCart, getAllCartProducts, changeProductQuantity, removeCartItems, getCartTotalAmount, placeOrdered, getProductList, OrderDetails, OrderCancelled, findByNumber, orderProductView, userWishlist, getAllWishlist, removeWishlistItems, generateRazorpay, verifyPayments, changePaymentStatus, addAddress, getAddress, getSearchProduct, getPriceFilter, addCheckCoupon, userEditAccount, userEditedProfile, getAllAddress, createPaypal, getCartOfferAmount, allCouponDetails, removeCartAfterOrder, WalletAmount, changeWalletAmount,doCheckEmail } = require('../Model/user-helpers');
const { respons, response } = require('express');
const session = require('express-session');
const expressEjsLayouts = require("express-ejs-layouts");
var paypal = require('paypal-rest-sdk');
const { getWalletAmount } = require("../Model/order-helpers");
const cc = require("currency-converter-lt")
require('dotenv').config()
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authTOKEN = process.env.TWILIO_TOKEN
const serviceID = process.env.SERVICE_ID
const client = require("twilio")(accountSID, authTOKEN, serviceID);
const PaypalclientID = process.env.PAYPAL_CLIENTID
const PaypalclientSecret = process.env.PAYPAL_CLIENTSECRET
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': PaypalclientID,
  'client_secret': PaypalclientSecret
});
let otpusers
let signupUsersData
module.exports = {

  
  sessionCheck: (req, res, next) => {
    try {
      if (req.session.users) {
        next();
      } else {
        res.redirect('/loginAndSignupButton');
      }
    } catch (error) {
      next(error);
    }
  },
  loginRedirect: (req, res, next) => {
    try {
      if (!req.session.users) {
        req.session.loggedIn = false;
      }
      if (req.session.users) {
        res.redirect('/');
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  nocache: (req, res, next) => {
    try {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    } catch (error) {
      next(error);
    }
  },
  verifyLogin: (req, res, next) => {
    try {
      if (req.session.users) {
        next();
      } else {
        res.redirect('/loginAndSignupButton');
      }
    } catch (error) {
      next(error);
    }
  },
  userLandingPage(req, res, next) {
    try {
      let users = req.session.users;
      showProduct().then((ShowProducts) => {
        getCategory().then((getCategoryData) => {
          res.render('userviews/landingpage', {
            user: true,
            ShowProducts,
            users,
            getCategoryData,
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },
  userLoged(req, res) {
    try {
      doLogin(req.body)
        .then((user) => {
          console.log(user);
          req.session.loggedIn = true;
          req.session.users = user;
          res.redirect('/');
        })
        .catch((error) => {
          console.log(error);
          res.render('userviews/userlogin and signup', {
            error: `${error.error}`,
          });
        });
    } catch (error) {
      next(error);
    }
  },
  userRegistered(req, res, next) {
    // try {
      doCheckEmail(req.body)
        .then((userdata) => {
          // console.log(userdata);
          // req.session.loggedIn = true;
          // req.session.users = userdata;
          // res.redirect('/');
          signupUsersData = req.body
          client.verify.v2.services(serviceID).verifications.create({
            to: `${signupUsersData.phone}`,
            channel: 'sms',
          }).then(()=>{

            res.render('userviews/signupOtp')
          })
        })
        .catch((error) => {
          res.render('userviews/userlogin and signup', {
            errors: `${error.error}`,
          });
        });
    // } catch (error) {
    //   next(error);
    // }
  },
  loginAndSignupButton(req, res, next) {
    try {
      res.render('userviews/userlogin and signup');
    } catch (error) {
      next(error);
    }
  },
  productDetails(req, res, next) {
    try {
      let users = req.session.users;
      productAllDetails(req.params.id)
        .then((DetailProduct) => {
          res.render('userviews/productDetails', {
            user: true,
            DetailProduct,
            users,
          });
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },
  logout(req, res) {
    try {
      req.session.loggedIn = false;
      req.session.users = null;
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
  // AddtoCart(req,res){

  //   users=req.session.users

  //   productAlldetails(req.params.id).then((DetailProduct)=>{

  //     res.render('userviews/productDetails',{user:true,DetailProduct,users})
  //   })


  // },

  async shopButton(req, res) {
    try {
      users = req.session.users;
      console.log(users);
  
      const ShowProducts = await showProduct();
      const getCategoryData = await getCategory();
      const priceFilter = await getPriceFilter(req.body.minprice, req.body.maxprice);
  
      res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData, priceFilter });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  
  async categoryFilter(req, res) {
    try {
      let users = req.session.user;
      let name = req.body;
  
      console.log(users);
      console.log(name);
  
      const ShowProducts = await filterByCategory(name);
      const getCategoryData = await getCategory();
  
      res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  
  async addToCart(req, res) {
    try {
      users = req.session.users;
      await addToCart(req.params.id, req.session.users._id);
      res.json({ status: true });
    } catch (error) {
      console.log(error);
      const errorMessage = "Stock limit Exceeded";
      res.status(400).json({ error: errorMessage });
    }
  },
  
  async cartPage(req, res) {
    try {
      let users = req.session.users;
      const products = await getAllCartProducts(req.session.users._id);
      console.log(products, ";;;;;;;;;;;;;;;;;;;;;;;;;;");
      const Total = await getCartTotalAmount(req.session.users._id);
  
      console.log(products, "++&&&&&&&&&&&&");
      if (products.length != 0) {
        res.render('userviews/CartPage', { user: true, products, users, Total });
      } else {
        res.render('userviews/cartEmpty', { user: true, users });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  
  async changeQuantity(req, res, next) {
    try {
      console.log(req.body);
      const response = await changeProductQuantity(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      const errorMessage = "Stock limit Exceeded";
      res.status(400).json({ error: errorMessage });
    }
  },
  
  async removeCartItem(req, res, next) {
    try {
      console.log(req.body);
      const response = await removeCartItems(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
 
  proceedToCheckout: async (req, res) => {
    try {
        let users = req.session.users;

        let [Total, products, usersAddress, walletAmount] = await Promise.all([
            getCartTotalAmount(req.session.users._id),
            getAllCartProducts(req.session.users._id),
            getAllAddress(users._id),
            WalletAmount(req.session.users._id)
        ]);

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
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
},
  async placeOrder(req, res) {
    try {
    let Total = parseInt(req.body.Total)
    console.log(Total, "+++++++++++++++++++------------");
    let finalPrice
    let TOtal = Number(req.body.Total)
    console.log(typeof TOtal)
    let currencyConverter = new cc({ from: "INR", to: "USD", amount: TOtal });
    let response = await currencyConverter.convert();
    console.log("response", response);
    var usdtotal = Math.round(response)
    console.log(usdtotal, "//usd");
    if (req.body.offerdata) {

      finalPrice = req.body.offerdata
    } else {

      finalPrice = TOtal
    }

    let users = req.session.users

    getProductList(req.body.userID).then((products) => {

      getCartTotalAmount(req.body.userID).then((Total) => {

        placeOrdered(req.body, products, finalPrice).then((orderID) => {

          function destruct(products) {
            let data = []
            for (let i = 0; i < products.length; i++) {
              let obj = {}
              obj.prod = products[i].item
              obj.quantity = products[i].quantity
              data.push(obj)
            }
            return data
          }

          if (req.body.payment_method == 'COD') {

            let ids = destruct(products)
            console.log(ids, "ids");

            console.log(`this is the idss :: ${ids}`);
            removeCartAfterOrder(ids, req.body.userID)
              .then(() => {

                res.json({ codSuccess: true })

              }).catch(() => {
                console.log("error occured while removing from cart after order");
              })


          }

          else if (req.body.payment_method == 'ONLINE') {

            generateRazorpay(orderID, Total).then((response) => {

              let ids = destruct(products)

              removeCartAfterOrder(ids, req.body.userID).then(() => {

                response.razorPay = true
                res.json(response)

              })



            })
          } else if (req.body.payment_method == 'Paypal') {

            // const Total = Math.floor(finalPrice/85)
            console.log(usdtotal, "}}}}}}}}}}}}}}}}}}}}}}}}}}");
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
                  "total": usdtotal
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
        

          } else if (req.body.payment_method == 'Wallet') {

            let ids = destruct(products)

            changeWalletAmount(req.body.userID, finalPrice)
              .then(() => {

                removeCartAfterOrder(ids, req.body.userID)
                  .then(() => {

                    res.json({ Wallet: true })

                  })
                  .catch(() => {
                    console.log("))))))))))))))))))))");
                    const error = "Sufficient balance for WalletAmount";
                    res.status(400).json({ error: error }); // send 400 Bad Request with custom error message
                  })
              })


          }

          changePaymentStatus(orderID).then(() => {

            let ids = destruct(products)

            removeCartAfterOrder(ids, req.body.userID).then(() => {

            })

          })

        })

      })



    }) 
  
  } catch (error) {
    console.log(error);
  
}
  },


  otpLogin(req, res) {
    try {
      let users = req.session.users;
      res.render('userviews/OTPLOGIN', { user: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  },
  
  otpVerify(req, res) {
    try {
      console.log(req.body, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      let users = req.session.users;
      console.log(req.body);
  
      const number = req.body.PhoneNumber;
  
      findByNumber(number)
        .then((user) => {
          console.log(user);
          otpusers = user;
  
          client.verify.v2
            .services(serviceID)
            .verifications.create({
              to: `+91${number}`,
              channel: 'sms',
            })
            .then(() => {
              res.render('userviews/OTPverification', { user: true, users });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(`Error: ${err.message}`);
            });
        })
        .catch((err) => {
          console.log(err);
          res.render('userviews/OTPLOGIN',{user:true,users});
        });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error: ${error.message}`);
    }
  },
  
  
  successOtpVerify(req, res) {
  try {
    console.log(req.body,"++++++++++++++)");
    const number = otpusers.phone;; // Define and initialize the "number" variable
      console.log('number:', number); // Log the value of the "number" variable
      
      client.verify.v2
        .services(serviceID)
        .verificationChecks.create({
          to: `${number}`,
          code: req.body.otplogin,
        })
        .then(async (data) => {
          if (data.status === 'approved') {
            req.session.loggedIn = true;
            req.session.users = otpusers;
            res.redirect('/');
          } else {
            console.log('OTP not matched');
            res.render('userviews/OTPverification');
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('Internal server error');
        });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  },
  
  
  addToWishlist(req, res) {
    try {
      console.log(req.params.id, req.session.users._id);
      users = req.session.users;
  
      userWishlist(req.params.id, req.session.users._id)
        .then((response) => {
          res.json({ status: true });
        })
        .catch(() => {});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  },
  
  wishlistPage(req, res) {
    try {
      let users = req.session.users;
  
      getAllWishlist(req.session.users._id)
        .then((products) => {
          res.render('userviews/wishlist', { user: true, products, users });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('Internal server error');
        });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  },
  
  removeWishlistItem(req, res) {
    try {
      console.log(req.body);
      removeWishlistItems(req.body).then((response) => {
        res.json(response)
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  verifyPayment(req, res) {
    try {
      console.log(req.body);
      verifyPayments(req.body).then(() => {
        changePaymentStatus(req.body['order[receipt]']).then(() => {
          console.log("payment successfully");
          res.json({ status: true })
        })
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  address(req, res) {
    try {
      let users = req.session.users
      console.log(req.params.id);
      console.log(users);
      getAllAddress(req.session.users._id).then((usersAddress) => {
        res.render('userviews/UserProfile', { user: true, users, usersAddress })
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  addAccount(req, res) {
    try {
      let users = req.session.users
      console.log(users);
      res.render('userviews/AddAddress', { user: true, users })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  addedAddress(req, res) {
    try {
      let users = req.session.users
      console.log(req.body);
      addAddress(req.body).then((addressID) => {
        res.redirect('/address')
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  getAddAddress(req, res) {
    try {
      let users = req.session.users
      getAllAddress(req.body.userID, req.body.username).then((userAddress) => {
        res.json(userAddress)
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  search(req, res) {
    try {
      console.log(req.body.searchValue);
      getSearchProduct(req.body.searchValue).then((data) => {
        res.json(data)
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  
  priceFilter(req, res) {
    try {
      users = req.session.users
      console.log(req.body);
      getPriceFilter(req.body.minprice, req.body.maxprice).then((ShowProducts) => {
        getCategory().then((getCategoryData) => {
          res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData })
        })
      }).catch((error) => {
        error = 'product not found';
        res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData })
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' })
    }
  },
  checkCoupon(req, res) {
    try {
      console.log("Mmmmmmmmmmmm,,,,,,,,,,,,,,,,,,");
      addCheckCoupon(req.body.data, req.body.Total).then((response) => {
        res.json(response);
      }).catch(() => {
        const error = "Invalid Coupon";
        res.status(400).json({ error: error });
      })
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  
  editAccount(req, res) {
    try {
      let users = req.session.users
      userEditAccount().then((EditAccount) => {
        res.render('userviews/EditAccount', { user: true, EditAccount, users })
      })
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  
  editedAddress(req, res) {
    try {
      userEditedProfile(req.params.id, req.body).then((updateAddress) => {
        res.redirect('/address');
      })
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  
  allCoupons(req, res) {
    try {
      let users = req.session.users
      allCouponDetails().then((Coupons) => {
        res.render('userviews/Coupons', { user: true, Coupons, users })
      })
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  
  wallet(req, res) {
    try {
      let users = req.session.users
      WalletAmount(req.session.users._id).then((walletAmount) => {
        res.render('userviews/WalletPage', { user: true, users, walletAmount })
      })
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  signupOtpVerification(req,res,next){
    client.verify.v2.services(serviceID).verificationChecks.create({
      to: `${signupUsersData.phone}`,
      code: req.body.otp,
    }).then(async (data) => {
      if (data.status === 'approved') {
        // Mark the user account as verified and log them in
       
          doSignup(signupUsersData)
        .then((userdata) => {
          console.log(userdata,")))))))))))))");
          req.session.loggedIn = true;
          req.session.users = userdata;
          res.redirect('/');
        })
        // req.session.loggedIn = true
        // req.session.users = await db.get().collection(collection.USER_COLLECTION).findOne({ phone: req.body.phone })
        // res.redirect('/')
      } else {
        res.render('userviews/signupOtp', { phone: req.body.phone, error: 'Invalid OTP' })
      }
    })

  }
}


