var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');
const { shippingStatus } = require('../Controller/admin_controller');
const { promiseImpl } = require('ejs');
const { PRODUCTOFFER_COLLECTION, PRODUCT_COLLECTION } = require('./collections');

module.exports={

  userOrderDetails:()=>{

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
            
              resolve(response)
         })

     })

},
shippingDetail:(orderID,shippingStatus)=>{
        
    console.log(orderID,shippingStatus);

    if(shippingStatus=='Ordered'|| shippingStatus=='Shipped' || shippingStatus=='Arraving' ||  shippingStatus=='Delivered' ){
       
        shippingStatus=shippingStatus
      }
      return new Promise((resolve,reject)=>{
       
         db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{

             $set:{
 
                shippingStatus :shippingStatus
                
             }
          }).then((response)=>{
               console.log(response);
             
               resolve(response)
          })

      })

},
orderDetails:(userID)=>{

    return new Promise(async(resolve,reject)=>{

       let OrderDetails= await db.get().collection(collection.ORDER_COLLECTION).find({userID:ObjectId(userID)}).sort({date:-1}).toArray()

       
       
       resolve(OrderDetails)
    })
},
orderCancelled:(orderID,status)=>{

    if(status=='placed'|| status=='pending'){

       status='order cancelled'
    }
    return new Promise((resolve,reject)=>{
     
       db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{

           $set:{

               status:status
           }
        }).then((response)=>{

             resolve(response)
        })

    })
  
},
orderProductView:(orderID)=>{
    console.log(orderID);
    return new Promise(async(resolve,reject)=>{

        let singleOrder= await db.get().collection(collection.ORDER_COLLECTION).aggregate([

            {
                $match: {_id:ObjectId(orderID)},
            },
            {
                $project:{

                    products:1,
                    deliveryDetails:1,
                    TotalAmount:1,
                    quantity:1
                },
            },
            {
                $unwind:'$products',
            },
            {
                $lookup:{

                    from:'product',
                    localField: 'products.item',
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
         
          resolve(singleOrder)
     
    })
  },
  billingAddress:(orderID)=>{
       
   
    
    
    return new Promise(async(resolve,reject)=>{
        

      let BillingAddress=await  db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(orderID)})

       

        resolve(BillingAddress)

    })
  },
  productOffer:(proID)=>{

   return new Promise(async(resolve,reject)=>{
  
    let productOffer = await db.get().collection(PRODUCT_COLLECTION).findOne({_id:ObjectId(proID)})

   

    resolve(productOffer)
   })

  },
  orderReturned:(orderID,shippingStatus)=>{

    if(shippingStatus=='Delivered'){

        shippingStatus='Returnprocessing'

     }
     return new Promise((resolve,reject)=>{
     
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{
 
            $set:{
 
                status:shippingStatus
            }
         }).then((response)=>{
 
              resolve(response)
         })
 
     })
  },
  orderProductList:(orderID)=>{
        
    console.log(orderID,"))))))))))))))))))))))))))))");
    return new Promise(async(resolve,reject)=>{
      

        let order= await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(orderID)})
         
        resolve(order.products)

     }).catch(()=>{

        reject()
     })

  },
  stockIncreamentAfterReturn:(item)=>{

    console.log("this is order",item);

    return new Promise(async(resolve,reject)=>{

        for(let i=0;i<item.length;i++){

            // item[i].quantity=Number(item[i].quantity)
        
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:item[i].prod},{
        
                $inc:{StockCount:+item[i].quantity}
            })
        
           await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:item[i].prod},[{
        
           $set:{productstock:{$cond:{if:{$gt:["$StockCount",1]},then:false,else:true}}},  
            
           }]).then(()=>{
        
            resolve()
        
           }).catch((error)=>{
        
            reject()
           })
        }


    })
  },
  orderReturnConfirm:(orderID,status)=>{

    if(status=='Returnprocessing'){

        status='ReturnConfirmed'

     }
     return new Promise(async(resolve,reject)=>{
        
     
       await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderID)},{

        
 
            $set:{
 
                status:status
                
            }
           
         }).then((response)=>{
             
            
              resolve(response)
         })
 
     })
  },
  getWalletAmount:(orderID)=>{

    return new Promise(async(resolve,reject)=>{

        let Wallet =await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(orderID)})

       

        resolve(Wallet)
    })
  },
  returnAfterCreateWallet:(TotalAmount,userID)=>{

    return new Promise(async(resolve,reject)=>{

     let wallet = await db.get().collection(collection.WALLET_COLLECTION).findOne({userID:ObjectId(userID)})

     if(wallet){
       
        db.get().collection(collection.WALLET_COLLECTION).updateOne({userID:ObjectId(userID)},

            [{ $set: { total: { $add: ["$total", TotalAmount] } } }]
        ).then(()=>{

            resolve()
        }).catch(()=>{

            reject()
        })

     }else{

        
        let walletObj={

            userID:ObjectId(userID),
            total : TotalAmount
        }
        db.get().collection(collection.WALLET_COLLECTION).insertOne(walletObj)
        .then((response)=>{
            resolve()
        }).catch((err)=>{
            reject()
        })
        
     }
    })
  }

}