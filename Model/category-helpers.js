var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');
const { shippingStatus } = require('../Controller/admin_controller');
const { promiseImpl } = require('ejs');

module.exports={

    getAllcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(getcategory)
        })
    },
    AddCategorys:(addcategory)=>{
    
        return new Promise(async(resolve,reject)=>{

     let category = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({name:addcategory.name})
     console.log(category,"PPPPP))((");
     if(!category){

        db.get().collection(collection.CATEGORY_COLLECTION).insertOne(addcategory).then((addcategory)=>{
    
            resolve(addcategory)
        })
     }else{


        reject({error:'Category Already use'})
     }
         
   
    
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
    
        },
        filterByCategory:(proCategory)=>{

            return new Promise(async(resolve,reject)=>{
    
                let ShowProducts=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:proCategory.name}).toArray()
                 
                resolve(ShowProducts)
            }).catch((error)=>{
    
                reject()
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
        InsertCategoryOffer:(catID)=>{

            catID.EndDate = new Date(catID.EndDate)
            catID.Discount = parseInt(catID.Discount)
            return new Promise((resolve,reject)=>{
              
            db.get().collection(collection.CATEGORYOFFER_COLLECTION).insertOne(catID).then((catoffer)=>{

            resolve(catoffer)
            })

           

            })
        },
        makeCategoryOffer:(catID)=>{
            
            let catname =catID.categoryname
             catID.Discount = parseInt(catID.Discount)
             let Discount = catID.Discount
             
          

                return new Promise(async (resolve, reject) => {
           
                    var offers = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
                        {
                            $match: { category: catname}
                        },
                        {
                            $project: { price: 1 }
                        },
        
                        {
                            $addFields: {
                                offer: { $subtract: ['$price', { $divide: [{ $multiply: ['$price', Discount] }, 100] }] }
        
                            }
                        }
                        
                    ]).toArray()
                    console.log(offers);
                   offers.forEach(element => {
                        db.get().collection(collection.PRODUCT_COLLECTION).updateMany({_id:element._id},{
                        $set:{
                          catoffer:element.offer
                        }
                      }).then((catoffer)=>{

                        resolve()
                      })
                    
                      });
            })

        }
}