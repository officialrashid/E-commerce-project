var db=require('./connectionmongo');
var collection=require('./collections');
var bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { body } = require('express-validator');
const { shippingStatus } = require('../Controller/admin_controller');
const { promiseImpl } = require('ejs');

module.exports={

getAllProduct:()=>{

    return new Promise(async(resolve,reject)=>{
       
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)

    })
},
getAllCategoryDropdown:()=>{

    return new Promise(async(resolve,reject)=>{

        let getcategorydropdown=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        console.log(getcategorydropdown);
        resolve(getcategorydropdown)

    })
},
adminAdd(product){
    
     product.StockCount=parseInt(product.StockCount)
    productstock=true
    product.price = parseInt(product.price)
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
getCategory:()=>{

    return new Promise(async(resolve,reject)=>{

        let geteditcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        console.log(geteditcategory);
        resolve(geteditcategory)
    })
},
adminEdit:(productid)=>{

    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productid)}).then((product)=>{

            resolve(product)
        })
    })
},
adminEditSubmit:(editid,body,img)=>{

  

  body.price = parseInt(body.price)
  body.StockCount=parseInt(body.StockCount)
    return new Promise(async(resolve,reject)=>{

      let product =await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(editid)});
     
      if(img.Image1){
          product.productImage[0] = img.Image1[0].filename;
      }
      if(img.Image2){
          product.productImage[1] = img.Image2[0].filename;
      }
      if(img.Image3){
          product.productImage[2] = img.Image3[0].filename;
      }
      if(img.Image4){
          product.productImage[3] = img.Image4[0].filename;
      }
        db.get().collection(collection.PRODUCT_COLLECTION)
        .updateOne({_id:ObjectId(editid)},{

            $set:{
                shoename:body.shoename,
                companyname:body.companyname,
                size:body.size,
                color:body.color,
                description:body.description,
                category:body.category,
                Image1:body.Image1,
                Image2:body.Image2,
                Image3:body.Image3,
                Image4:body.Image4,
                dateofmanufacture:body.dateofmanufacture,
                StockCount:body.StockCount,
                price:body.price
                


            },
            
        }).then((response)=>{

            resolve()
        })
    })
},
productListAndUnlist:(proID,stock)=>{
    console.log(proID,stock);
     if(stock=='true'){

         stock=false
     }else{

         stock=true
     }
     return new Promise((resolve,reject)=>{

         db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proID)},{
           
             $set:{

                 productstock:stock
             }

         }).then((response)=>{

           console.log(response);
           resolve(response)
         })


     })
 },
 insertProductOffer:(OfferID)=>{
       
    OfferID.EndDate = new Date(OfferID.EndDate)
    OfferID.Discount = parseInt(OfferID.Discount)
    OfferID.Total =parseInt(OfferID.Total)
    
    return new Promise((resolve,reject)=>{

      db.get().collection(collection.PRODUCTOFFER_COLLECTION).insertOne(OfferID).then((proOffers)=>{

        resolve(proOffers)
      })
    })
  },
  getProductOffer:(OfferID)=>{
        
    let Total = parseInt(OfferID.price)
    
     let proID = OfferID.proID
    
     return new Promise(async(resolve,reject)=>{
     
       const offer = await db.get().collection(collection.PRODUCTOFFER_COLLECTION).aggregate([
           {
               $match: {
                 $and: [
                   { proID: proID },
                   { EndDate : { $gte: new Date() } },
                 
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
                         { $multiply: [Total, "$Discount"] },
                         100
                       ]
                     }
                   ]
                 }
               }
             }
         
       ]).toArray()

     
       db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proID)},{

         $set:{
           offerAmount:offer[0].offerAmount
         }
       })
       if(offer.length !=0){
           resolve(offer[0]?.offerAmount)
         }else{
           reject()
         }
    
       
     }).catch((err)=>{
          
       
     })

   },
   productAllDetails:(productID)=>{

    return new Promise((resolve,reject)=>{
     
     db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productID)}).then((DetailProduct)=>{

        resolve(DetailProduct)
     }).catch(()=>{

        reject()
     })

    })
},




}