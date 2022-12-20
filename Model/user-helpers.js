var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { productDetails } = require('../Controller/user_controller');
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
                    })

                 }else{

                 
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({users:ObjectId(userID)},{

                    $push:{products:proObj}

                }).then((respons)=>{

                    resolve()
                })

            }

            }else{

                let cartObj={

                    users:ObjectId(userID),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((respons)=>{

                    resolve()
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
        })
    },
    changeProductQuantity:(cartDetails)=>{
       
        cartDetails.count=parseInt(cartDetails.count)
         cartDetails.quantity=parseInt(cartDetails.quantity)
       
        return new Promise((resolve,reject)=>{
            
            if(cartDetails.count==-1 && cartDetails.quantity==1){
                console.log("+++++++++++++++++++++++++++--------------------");
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:ObjectId(cartDetails.cart)},
                {
                    $pull:{products:{item:ObjectId(cartDetails.products)}}
                }
                ).then((response)=>{

                    resolve({removeProduct:true})
                })
            }else{
                console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(cartDetails.cart),'products.item':ObjectId(cartDetails.products)},{

                $inc:{'products.$.quantity':cartDetails.count}
            }).then((response)=>{

                resolve(true)
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
        })
       })
       

    }
    
  
}