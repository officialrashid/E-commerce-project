var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');

// const { adminresponse } = require('../app');

module.exports={
    //   admin login check
    doadminSignup:(adminData)=>{
       
        // return new Promise(async(resolve,reject)=>{
           
        //     adminData.password=await bcrypt.hash(adminData.password,10)
            
        //     db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData)
          
        //     resolve(adminData)
           
        // })

        return new Promise(async(resolve,reject)=>{
  
            let loginStatus=false;
            let adminresponse={}

            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})

            if(admin){

                await bcrypt.compare(adminData.password,admin.password).then((adminDataStatus)=>{

                    if(adminDataStatus){

                         adminresponse.admin=admin
                         adminresponse.adminDataStatus=true
                         resolve(adminresponse)
                    }else{

                        reject({error:"Incorrect password"})
                    }

                })
            }else{
                reject({error:"Incorrect username"})
            }
        })
        // admin log check end
    },

    // getAll users
    getAllusers:()=>{

        return new Promise(async(resolve,reject)=>{
        
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)

        })
        // getAll users End
    },

  adminadd(product){
        return new Promise(async(resolve,reject)=>{
            var item=await db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product)
            let data={
                id:item.insertedId
            }
            if(item){
                resolve(data)
            }else{
                reject()
            }
        }).catch((err)=>{
            console.log(err);
        })
    },

    getAllproduct:()=>{

        return new Promise(async(resolve,reject)=>{
           
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)

        })
    },
    adminedit:(productid)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productid)}).then((product)=>{

                resolve(product)
            })
        })
    },
    adminEditsubmit:(editid,body)=>{
     
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:ObjectId(editid)},{

                $set:{
                    shoename:body.shoename,
                    companyname:body.companyname,
                    size:body.size,
                    color:body.color,
                    description:body.description,
                    category:body.category,
                    Image:body.Image,
                    dateofmanufacture:body.dateofmanufacture,
                    price:body.price
                    


                }
            }).then((response)=>{

                resolve()
            })
        })
    },

    removeProduct:(deleteid)=>{

        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(deleteid)}).then((response)=>{

                resolve(response)

            })
        })
    },
    AddCategorys:(addcategory)=>{
    
    return new Promise(async(resolve,reject)=>{
     
 db.get().collection(collection.CATEGORY_COLLECTION).insertOne(addcategory).then((addcategory)=>{

        resolve()
    })

    })
       

    },
    getAllcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(getcategory)
        })
    },
    adminCategoryEdit:(categoryid)=>{
      
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectId(categoryid)}).then((categoryEdit)=>{

                resolve(categoryEdit)
            })
        })
    
    },
    CategoryEdit:(EditCategoryId,catID)=>{
       
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.CATEGORY_COLLECTION)
            .updateOne({_id:ObjectId(EditCategoryId)},{

                $set:{
                    
                    name:catID.name
                    


                }
            }).then((response)=>{

                resolve()
            })
        })

    },
    removeCategory:(deleteCategoryid)=>{
      
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:ObjectId(deleteCategoryid)}).then((response)=>{

                resolve(response)

            })
        })

    }

}