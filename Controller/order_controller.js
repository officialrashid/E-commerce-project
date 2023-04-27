const { respons, response } = require('express');

const { userOrderDetails, productView, adminOrderCancellled, shippingDetail, orderDetails, orderCancelled, orderProductView, billingAddress, productOffer, orderReturned, orderProductList, stockIncreamentAfterReturn, orderReturnConfirm, getWalletAmount, returnAfterCreateWallet ,cancelAfterCreateWallet} = require('../Model/order-helpers')

module.exports = {
  sessionCheck: (req, res, next) => {
    try {
      if (req.session.users) {
        next();
      } else {
        res.redirect('/loginAndSignupButton');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  loginredirect: (req, res, next) => {
    try {
      if (!req.session.users) {
        req.session.loggedIn = false;
      } else if (req.session.users) {
        res.redirect('/');
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  nocache: (req, res, next) => {
    try {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  verifyLogin: (req, res, next) => {
    try {
      if (req.session.users) {
        next();
      } else {
        res.redirect('/loginAndSignupButton');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  orders(req, res) {
    try {
      userOrderDetails().then((UserOrder) => {
        res.render('adminviews/UserOrders', { user: false, UserOrder });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  adminProductView(req, res) {
    try {
      productView(req.params.id).then((singleOrder) => {
        res.render('adminviews/OrderProductDetails', { singleOrder, user: false });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  adminCancelOrder(req, res) {
    try {
      adminOrderCancellled(req.params.id, req.body.status).then((response) => {
        res.redirect('/order/orders');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  shippingStatus(req, res, next) {
    try {
      shippingDetail(req.params.id, req.body.shippingStatus).then((response) => {
        res.redirect('/order/orders');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  userOrderView(req, res) {
    try {
      let users = req.session.users;
      orderDetails(req.session.users._id).then((OrderDetails) => {
        res.render('userviews/UserOrderView', { user: true, OrderDetails, users });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  
  orderCancel(req, res) {
    try {
     
      orderCancelled(req.params.id, req.body.status ,req.body.payment).then(() => {
         
        orderProductList(req.params.id).then((products) => {
  
          console.log(products, "products coming");
  
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
          let ids = destruct(products)
          console.log(ids, "ids");
  
          stockIncreamentAfterReturn(ids).then(() => {
            
        getWalletAmount(req.params.id).then((wallet) => {
            

         if(req.body.payment == 'ONLINE' || req.body.payment == 'Paypal' || req.body.payment == 'Wallet'){

      
          cancelAfterCreateWallet(wallet.TotalAmount, wallet.userID ,req.body.payment).then(() => {

          
        res.redirect('/order/userOrderView');
        
      });
    }else{

      res.redirect('/order/userOrderView');
    }
        
    });
  });
});
  });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
  userProductView(req, res) {
    try {
      console.log(req.body);
      let users = req.session.users
      orderProductView(req.params.id).then((singleOrder) => {
  
        billingAddress(req.params.id).then((BillingAddress) => {
  
          productOffer(req.params.id).then(() => {
  
            console.log(BillingAddress, "billingAddress");
  console.log(singleOrder,"single order is coming and wonderful");
            res.render('userviews/orderviewProducts', { user: true, singleOrder, users, BillingAddress })
  
          })
  
        })
  
      })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while loading the order product view page.')
    }
  },
  orderDetails(req, res) {
    try {
      let users = req.session.users
      res.render('userviews/OrderDetails', { user: true, users })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while loading the order details page.')
    }
  },
  orderReturn(req, res) {
    try {
      orderReturned(req.params.id, req.body.status).then((response) => {
        res.redirect('/order/userOrderView')
      })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing the order return request.')
    }
  },
  adminReturnedOrder(req, res) {
    try {
      orderReturnConfirm(req.params.id, req.body.status).then(() => {
        orderProductList(req.params.id).then((products) => {
  
          console.log(products, "products coming");
  
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
          let ids = destruct(products)
          console.log(ids, "ids");
  
          stockIncreamentAfterReturn(ids).then(() => {
  
            getWalletAmount(req.params.id).then((wallet) => {
  
              returnAfterCreateWallet(wallet.TotalAmount, wallet.userID).then(() => {
                res.redirect('/order/orders')
              })
  
            })
  
          })
  
        })
      })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while processing the admin returned order request.')
    }
  }
  

}