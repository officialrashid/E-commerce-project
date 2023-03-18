var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { productDetails, Address } = require('../Controller/user_controller');
const { promiseImpl } = require('ejs');

const Razorpay = require('razorpay');
require('dotenv').config()
const { get } = require('http');
const { resolve } = require('path');
var paypal = require('paypal-rest-sdk');
const { Number } = require('twilio/lib/twiml/VoiceResponse');
const Razorpaykeyid = process.env.RAZORPAY_KEYID
const Razorpaykeysecret=process.env.RAZORPAY_KEYSECRET
const PaypalclientID = process.env.PAYPAL_CLIENTID
const PaypalclientSecret=process.env.PAYPAL_CLIENTSECRET
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id':PaypalclientID,
    'client_secret':PaypalclientSecret 
  });
  
  
var instance = new Razorpay({
    key_id: Razorpaykeyid,
    key_secret: Razorpaykeysecret,
  });
module.exports={


    // user signup database section//
    doSignup:(userdata)=>{
         
        userdata.createAt=new Date().toDateString()
        userdata.isBlocked=false;
        if(userdata.phone.substring(0,3)!='+91'){
            userdata.phone=`+91${userdata.phone}`
        }

        return new Promise(async(resolve,reject)=>{
        let user= await db.get().collection(collection.USER_COLLECTION).findOne({$or:[{email:userdata.email},{phone:userdata.phone}]})
        console.log(user);
        if(user){
            
            reject({error:'Email already exists'})
        }
        else{
            
            userdata.password=await bcrypt.hash(userdata.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata)
            resolve(userdata)
        }

        })
    },
    doLogin:(userdata)=>{

        return new Promise(async(resolve,reject)=>{
         
         let loginStatus=false;
         let response={}

         let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userdata.email})
         if(user){
            
            if(user.isBlocked){

                reject({error:"user is blocked"})
            }else{
                
                bcrypt.compare(userdata.password,user.password).then((status)=>{
            
                    console.log(status);
                   if(status){
         
                       
                       response.user=user
                       response.status=true
                       resolve(user)
                       
                   }
                   else{
       
                       reject({error:"Incorrect password"})
                   }
                })
            }
         }else{
            reject({error:"Incorrect Email"})
         }
        });
    },
    ShowProduct:()=>{

        return new Promise(async(resolve,reject)=>{

            let ShowProducts=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(ShowProducts)
        })
    },
    productAlldetails:(productID)=>{

        return new Promise((resolve,reject)=>{
         
         db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productID)}).then((DetailProduct)=>{

            resolve(DetailProduct)
         }).catch(()=>{

            reject()
         })

        })
    },

    getCategory:()=>{
         
        return new Promise(async(resolve,reject)=>{

        
        let getCategoryData=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        resolve(getCategoryData)
        

        }).catch((error)=>{

         reject()
        })
       
    },  
    filterByCategory:(proCategory)=>{

        return new Promise(async(resolve,reject)=>{

            let ShowProducts=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:proCategory.name}).toArray()
             console.log(ShowProducts);
            resolve(ShowProducts)
        }).catch((error)=>{

            reject()
        })
    },
    AddTOCART:(proID,userID)=>{
         
      
        let proObj={

            item:ObjectId(proID),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{

            let products = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proID)})

           

            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({users:ObjectId(userID)})

            if(userCart){
              
                let proExist=userCart.products.findIndex(product => product.item==proID)
                 console.log(proExist);

                 if(proExist!=-1){

                    if(products.StockCount != userCart.products[proExist].quantity){

                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({users:ObjectId(userID),'products.item':ObjectId(proID)},{
    
                            $inc:{'products.$.quantity':1}
                        }).then(()=>{
    
                            resolve()
                        }).catch(()=>{
    
                            return reject()
                        })

                    }else{

                       reject()
                    }

              

                 }else{

                 
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({users:ObjectId(userID)},{

                    $push:{products:proObj}

                }).then((respons)=>{

                    resolve()
                }).then(()=>{

                    reject()
                })

            }

            }else{

                let cartObj={

                    users:ObjectId(userID),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((respons)=>{

                    resolve()
                }).catch(()=>{

                    reject()
                })
            }
        })
    },
    getAllCartProducts:(userID)=>{

        return new Promise(async(resolve,reject)=>{

            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([

                {
                    $match:{users:ObjectId(userID)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{

                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{

                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'products'
                    },
                    
                },
                 {

                    $project:{

                        item:1,quantity:1,products:{$arrayElemAt:['$products',0]}
                    }
                 }

            ]).toArray()
            
            resolve(cartItems)
        }).catch(()=>{

            reject()
        })
    },
    changeProductQuantity:(cartDetails)=>{
       
        cartDetails.count=parseInt(cartDetails.count)
         cartDetails.quantity=parseInt(cartDetails.quantity)
       
        return new Promise(async(resolve,reject)=>{

            let stock= await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(cartDetails.products)})
            stock=stock.StockCount
            if(stock<(cartDetails.quantity +cartDetails.count)){
                console.log("entered reject");
                return   reject()
            }
            
            if(cartDetails.count==-1 && cartDetails.quantity==1){
                
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:ObjectId(cartDetails.cart)},
                {
                    $pull:{products:{item:ObjectId(cartDetails.products)}}
                }
                ).then((response)=>{

                    resolve({removeProduct:true})
                }).catch(()=>{

                    reject()
                })
            }else{
                console.log(cartDetails);
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(cartDetails.cart),'products.item':ObjectId(cartDetails.products)},{

                $inc:{'products.$.quantity':cartDetails.count}
            }).then((response)=>{

                resolve(true)
            }).catch(()=>{

                reject()
            })
        }

        })

    },
    removeCartItems:(cartdata)=>{
       
       return new Promise((resolve,reject)=>{

        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:ObjectId(cartdata.cart)},
        {
            $pull:{products:{item:ObjectId(cartdata.products)}}
        }
        ).then((response)=>{

            resolve(response)
        }).catch(()=>{

            reject()
        })

       })
       

    },
    getCartTotalAmount:(userID)=>{
      
       return new Promise(async(resolve,reject)=>{
        
        let Total=await db.get().collection(collection.CART_COLLECTION).aggregate([

            {
                $match:{users:ObjectId(userID)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{

                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{

                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'products'
                },
                
            },
            
             {

                $project:{

                    item:1,quantity:1,products:{$arrayElemAt:['$products',0]}
                }
             },
             {
                $set: {
                  final: {
                    $switch: {
                      branches:
                      [{
                        case: { $and: ['$products.offerAmount'] },
                        then: '$products.offerAmount',
                      },
                      {
                        case: { $and: ['$products.price'] },
                        then: '$products.price',
                      },
                      {
                        case: { $and: ['$products.catoffer'] },
                        then: '$products.catoffer',
                      },
                      ],
                      default: '',
                    },
                  },
                },
              },
    
             
             {
                $group:{

                    _id:null,
                     Total:{$sum:{$multiply:[{$toDouble :"$quantity"},{$toDouble:"$final"}]}}

                }
             }

        ]).toArray()
         
        
        if (Total.length > 0) {
            resolve(Total[0].Total);
            console.log(Total[0].Total,"+++++++++++++");
            
          } else {
            resolve(0); // or some other appropriate value
          }
          
        
       })

    },
    PlaceOrdered:(order,products,Total)=>{
         
        
       
       return new Promise(async(resolve,reject)=>{

         console.log(order,"this order is coming and wonderful",products,Total);
         let status=order.payment_method==='COD'?'placed':'pending'
         let shippingStatus='ordered'

         let address= await db.get().collection(collection.USER_COLLECTION).aggregate([

          orderObj={

            deliveryDetails:{

                fname:order.fname,
                cname:order.cname,
                country:order.country,
                add1:order.add1,
                add2:order.add2,
                town:order.town,
                // country:order.country,
                postcode:order.postcode,
                phone:order.phone,
                email:order.email

            },
        
            userID:ObjectId(order.userID),
            PaymentMethod:order.payment_method,
            products:products,
            TotalAmount:parseInt(Total),
            status:status,
            shippingStatus:shippingStatus,
            date:new Date()
         }
         ])
         db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
            
           
           
              resolve(response.insertedId)
         })
        
})


},
removeCartAfterOrder:(item,userID)=>{

console.log("this is cart",item);

return new Promise(async(resolve,reject)=>{

for(let i=0;i<item.length;i++){

    // item[i].quantity=Number(item[i].quantity)

    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:item[i].prod},{

        $inc:{StockCount:-item[i].quantity}
    })

   await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:item[i].prod},[{

   $set:{productstock:{$cond:{if:{$lt:["$StockCount",1]},then:false,else:true}}},  
    
   }]).then(()=>{

    db.get().collection(collection.CART_COLLECTION).deleteOne({users:ObjectId(userID)})

    console.log("delte cart");

    resolve()

   }).catch((error)=>{

    reject()
   })
}

})
},

getproductList:(userID)=>{

     return new Promise(async(resolve,reject)=>{
      

        let cart= await db.get().collection(collection.CART_COLLECTION).findOne({users:ObjectId(userID)})
         
        resolve(cart.products)

     }).catch(()=>{

        reject()
     })

    },
   
   
     findByNumber:(num)=>{
        console.log(num);
        num = "+91"+num
        return new Promise(async (resolve, reject) => {
          const user = await db.get().collection(collection.USER_COLLECTION).findOne({phone: num });
         
          if (user) {
            if (user.isBlocked) {
              reject({ err: 'This account is block' });
            } else {
                
              resolve(user);
            }
          } else {
            reject({ err: 'account not found' });
          }
        });
      },

    
      UserWishlist:(proID,userID)=>{
          
    
            let proObj={

                item:ObjectId(proID),
                
            }
            return new Promise(async(resolve,reject)=>{
                    
               

                let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({users:ObjectId(userID)})
    
                if(wishlist){
                  
                    let proExist=wishlist.products.findIndex(product => product.item==proID)
                     console.log(proExist);
    
                     if(proExist!=-1){
    
                        db.get().collection(collection.WISHLIST_COLLECTION)
                        .updateOne({users:ObjectId(userID),'products.item':ObjectId(proID)},{
                             
                           $pull:{products:{item:ObjectId(proID)}}
                           
                        }).then(()=>{
    
                            resolve()
                        }).catch(()=>{
    
                            reject()
                        })
    
                     }else{
    
                     
                    db.get().collection(collection.WISHLIST_COLLECTION)
                    .updateOne({users:ObjectId(userID)},{
    
                        $push:{products:proObj}
    
                    }).then((respons)=>{
    
                        resolve()
                    }).then(()=>{
    
                        reject()
                    })
    
                }
    
                }else{
    
                    let cartObj={
    
                        users:ObjectId(userID),
                        products:[proObj]
                    }
                    
                    db.get().collection(collection.WISHLIST_COLLECTION).insertOne(cartObj).then((respons)=>{
                        
                        resolve()
                    }).catch((err)=>{
    
                        reject()
                    })
                }
            })
        


      },
      getAllWishlist:(userID)=>{

        return new Promise(async(resolve,reject)=>{

            let wishlistItem=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([

                {
                    $match:{users:ObjectId(userID)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{

                        item:'$products.item',
                        // quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{

                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'products'
                    },
                    
                },
                 {

                    $project:{

                        item:1,quantity:1,products:{$arrayElemAt:['$products',0]}
                    }
                 }

            ]).toArray()
            console.log(wishlistItem);
            resolve(wishlistItem)

        }).catch(()=>{

            reject()
        })

      },
      removeWishlistItems:(wishlistData)=>{
           
        return new Promise((resolve,reject)=>{


            db.get().collection(collection.WISHLIST_COLLECTION)
            .updateOne({_id:ObjectId(wishlistData.wishlist)},
            {
                $pull:{products:{item:ObjectId(wishlistData.products)}}
            }
            ).then((response)=>{
    
                resolve(response)
            }).catch(()=>{
    
                reject()
            })
        })

      },
      generateRazorpay:(orderID,Total)=>{
       
        return new Promise((resolve,reject)=>{
           
         var options = {

            amount : Total*100,
            currency: "INR",
            receipt:""+orderID
         };
         instance.orders.create(options, function(err, order){
            if(err){
              console.log(err);
            }
          console.log("new order:",order);
          resolve(order)
         });
            
        })

      },
        
  createPaypal:(payment)=>{
    return new Promise((resolve,reject)=>{
     paypal.payment.create(payment, function (error, payment) {
       if (error) {
           reject(error)
       } else {
           console.log("Create Payment Response");
           console.log(payment);
           resolve(payment);
       }
       });
    })
   }, 

    verifypayments:(details)=>{

       return new Promise((resolve,reject)=>{

        var crypto = require('crypto');

        var hmac = crypto.createHmac('sha256', 'ryN0cxihAGL73Aa1SMT8HNS9');

        hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
        hmac=hmac.digest('hex')

        if(hmac==details['payment[razorpay_signature]']){

            resolve()
        }else{

            reject()
        }

       })

      },
      changePaymentStatus:(orderID)=>{

      return new Promise((resolve,reject)=>{

      db.get().collection(collection.ORDER_COLLECTION)
      .updateOne({_id:ObjectId(orderID)},

      {
       
        $set:{

            status:'placed'
        }

      }
      
      
      ).then(()=>{

        resolve()
      })

      })


      },
    
      AddAddress:(addressID)=>{

        return new Promise(async(resolve,reject)=>{

            let Address= await db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(addressID.userID)},{

              
                $push:{

                    'Address':{
                      
                        'addressID':ObjectId(),
                        name:addressID.fname,
                        'cname':addressID.cname,
                        'country':addressID.country,
                        'add1':addressID.add1,
                        'add2':addressID.add2,
                        'town':addressID.town,
                        'postcode':addressID.postcode,
                        'phonenumber':addressID.phone,
                        'email':addressID.email

                    }

                

    
                }


            }).then((Address)=>{

               resolve()
            }).catch(()=>{

                reject()
            })

           
            
        })

            
        },
        getAddress:(userID)=>{
       
        return new Promise(async(resolve,reject)=>{

             await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(userID)}).then((Address)=>{

                 resolve(Address)
            })
        })

        },
        getAddress:(userID)=>{

            return new Promise((resolve,reject)=>{

                db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(userID)}).then((userAddress)=>{
                  
                   
                  resolve(userAddress)
                })
            })
        },

        getSearchProduct:(value)=>{
            
            
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({$text: {$search: value}}).then((productDATA)=>{
                       
    
                    resolve(productDATA)
    
                })
            })
        },
        getPriceFilter: (min, max) => {

            min = parseInt(min)
            max = parseInt(max)
            
            return new Promise(async (resolve, reject) => {
               
              let priceFilter = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
                {
                  $match: {
                    price: { $gte: min, $lte: max }
                  }
                }
                
              ]).toArray();
              
              resolve(priceFilter);
            }).catch(()=>{

                reject()
            })
          },
          
          AddCheckCoupon:(code,Total)=>{

            console.log(code);
            console.log(Total);
            Total = parseInt(Total)
           
            return new Promise(async(resolve,reject)=>{
              
                const coupon = await db.get().collection(collection.COUPON_COLLECTION).aggregate([
                    {
                        $match: {
                          $and: [
                            { Code: code },
                            { MaximumAmounts:{ $gte: Total } },
                            { EndDates : { $gte: new Date() } },
                            { StartDates: { $lte: new Date() } }
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
                                  { $multiply: [Total, "$Discounts"] },
                                  100
                                ]
                              }
                            ]
                          }
                        }
                      }
                  
                ]).toArray()
               
                if(coupon.length !=0){
                    resolve(coupon[0]?.offerAmount)
                  }else{
                    reject()
                  }
             
                
              }).catch((err)=>{
                    
                reject()
                
              })
    
        },
        userEditAccount:()=>{

         return new Promise((resolve,reject)=>{

          db.get().collection(collection.USER_COLLECTION).find().toArray().then((EditAccount)=>{
             
            
            resolve(EditAccount[0])
          })

         }) 
        },
        userEditedProfile:(userID,body)=>{
               
           return new Promise(async(resolve,reject)=>{

            await db.get().collection(collection.USER_COLLECTION).findOneAndUpdate({_id:ObjectId(userID)},{

                $set:{

                    name:body.fname,
                    cname:body.cname,
                    country:body.country,
                    add1:body.add1,
                    add2:body.add2,
                    town:body.town,
                    postcode:body.postcode,
                    phonenumber:body.phone,
                    email:body.email

                }
            })
                 
                resolve()
        
           })
        },
        getAllAddress:(userID)=>{

            console.log(userID,"ITS USER ID ----");
            return new Promise(async(resolve,reject)=>{
               
                let userdata = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userID) }).then((userdata)=>{

                    console.log(userdata,"::::::::::::::::::::::");
                    resolve(userdata)
    
                })
               
            })
        },
        getCartOfferAmount:((userID)=>{
          
            return new Promise(async(resolve,reject)=>{
        
                let Offer=await db.get().collection(collection.CART_COLLECTION).aggregate([
        
                    {
                        $match:{users:ObjectId(userID)}
                    },
                    {
                        $unwind:'$products'
                    },
                    {
                        $project:{
        
                            item:'$products.item',
                            quantity:'$products.quantity'
                        }
                    },
                    {
                        $lookup:{
        
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'products'
                        },
                        
                    },
                     {
        
                        $project:{
        
                            item:1,quantity:1,products:{$arrayElemAt:['$products',0]}
                        }
                     },
                     {
                        $group:{
        
                            _id:null,
                             Offer:{$sum:{$multiply:[{$toDouble :"$quantity"},{$toDouble:"$products.offerAmount"}]}}
        
                        }
                     }
        
                ]).toArray()
                 
                
                if (Offer.length > 0) {
                    resolve(Offer[0].Offer);
                    
                    
                  } else {
                    resolve(0); // or some other appropriate value
                  }
                  
                
               })
        

        }),
        AllCouponDetails:()=>{
          
            return new Promise(async(resolve,reject)=>{


                let AllCoupons = await db.get().collection(collection.COUPON_COLLECTION).find().toArray()

                resolve(AllCoupons)
            })
        
        },
        WalletAmount:(userID)=>{
         
            return new Promise(async(resolve,reject)=>{

                let WalletAmount =await db.get().collection(collection.WALLET_COLLECTION).findOne({userID:ObjectId(userID)})

                console.log("walletAmount",WalletAmount);

                resolve(WalletAmount)
            })

        },
        changeWalletAmount:(userID,TotalAmount)=>{
            return new Promise(async(resolve,reject)=>{
                let wallet = await db.get().collection(collection.WALLET_COLLECTION).findOne({userID:ObjectId(userID)})
              
                    db.get().collection(collection.WALLET_COLLECTION).updateOne(
                        {userID:ObjectId(userID)},
                        [{ $set: { total: { $subtract: ["$total", parseInt(TotalAmount)] } } }]
                    ).then(()=>{
                        resolve()
                    })
                
            })
        }
        
     }
   

        
          
 
    
  
