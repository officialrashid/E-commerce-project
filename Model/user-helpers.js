var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { productDetails } = require('../Controller/user_controller');
const { promiseImpl } = require('ejs');
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

            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({users:ObjectId(userID)})

            if(userCart){
              
                let proExist=userCart.products.findIndex(product => product.item==proID)
                 console.log(proExist);

                 if(proExist!=-1){

                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({users:ObjectId(userID),'products.item':ObjectId(proID)},{

                        $inc:{'products.$.quantity':1}
                    }).then(()=>{

                        resolve()
                    }).catch(()=>{

                        reject()
                    })

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
       
        return new Promise((resolve,reject)=>{
            
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
                $group:{

                    _id:null,
                     Total:{$sum:{$multiply:[{$toDouble :"$quantity"},{$toDouble:"$products.price"}]}}

                }
             }

        ]).toArray()
         
        
        if (Total.length > 0) {
            resolve(Total[0].Total);
          } else {
            resolve(0); // or some other appropriate value
          }
          
        
       })

    },
    PlaceOrdered:(order,products,Total)=>{

       return new Promise((resolve,reject)=>{

         console.log(order,products,Total);
         let status=order.payment_method==='COD'?'placed':'pending'
         let orderObj={

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
            TotalAmount:Total,
            status:status,
            date:new Date()
         }
         db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
            
            db.get().collection(collection.CART_COLLECTION).deleteOne({users:ObjectId(order.userID)})
              resolve()
         })
       })
    },
    getproductList:(userID)=>{

     return new Promise(async(resolve,reject)=>{
      

        cart= await db.get().collection(collection.CART_COLLECTION).findOne({users:ObjectId(userID)})
         
        resolve(cart.products)
     })

    },
    OrderDetails:(userID)=>{

        return new Promise(async(resolve,reject)=>{

           let OrderDetails= await db.get().collection(collection.ORDER_COLLECTION).find({userID:ObjectId(userID)}).toArray()

           resolve(OrderDetails)
        })
    },
    OrderCancelled:(orderID,status)=>{

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
       
    }

    
  
}