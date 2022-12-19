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

        return new Promise(async(resolve,reject)=>{

            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({users:ObjectId(userID)})

            if(userCart){
              
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({users:ObjectId(userID)},{

                    $push:{products:ObjectId(proID)}

                }).then((respons)=>{

                    resolve()
                })

            }else{

                let cartObj={

                    users:ObjectId(userID),
                    products:[ObjectId(proID)]
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
                    $lookup:{

                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[

                            {
                                $match:{

                                    $expr:{

                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }

                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
    
  
}