const {respons, response}=require('express');
const {getAllProduct,getAllCategoryDropdown,adminAdd,getCategory,adminEdit,adminEditSubmit,productListAndUnlist,insertProductOffer,getProductOffer,productAllDetails,getAllProductOffer}=require('../Model/product-helpers');
const multer = require("multer");
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    
    cb(null,'./public/Product-images')
  },
  filename:(req,file,cb)=>{
    console.log(file);
    cb(null,Date.now()+ '-'+Math.round(Math.random()*1E9)+'.jpg')
  }

})
  const upload=multer({storage:storage})
  
module.exports={
   
    sessionCheck:(req,res,next)=>{
     
        if(req.session.users){
           
            next();
        }else{

            res.redirect('/LoginandSignupButton')
        }
    },
    loginredirect:(req,res,next)=>{

        if(!req.session.users){
      
          req.session.loggedIn=false
      
        }if(req.session.users){
          
          res.redirect('/')
        }else{
          next();
        }
      },
      nocache:(req, res, next)=>{
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
      },
      verifyLogin:(req,res,next)=>{

        if(req.session.users){
          
          next()

        }else{

          res.redirect('/LoginandSignupButton')
        }
      },


    stocks(req,res,next){
    
      getAllProduct().then((products)=>{
         
            res.render('adminviews/adminStocks',{user:false,products})
        })
       
    
    
       },
       addProduct(req,res,next){
    
        getAllCategoryDropdown().then((getcategorydropdown)=>{
    
        res.render('adminviews/AddProduct',{user:false,getcategorydropdown})
        })
        
        
       },
       addedProduct(req,res,next){
         
        const files = req.files
        console.log(files);
        const fileName = files.map((file)=>{
            return file.filename
        })

        let data=req.body
         data.productImage=fileName
         adminAdd(req.body).then((data)=>{

       
              res.redirect('/product/Stocks')
                 
        })

    
   },
   editProduct(req,res){

    let productid=req.params.id
    getCategory().then((geteditcategory)=>{

   
      adminEdit(productid).then((product)=>{
      
      res.render('adminviews/EditProduct',{user:false,product,geteditcategory})


    })
   
    })
   },
   editSubmit:async(req,res)=>{

    let id=req.params.id
    let data = req.body
    let img= req.files
        console.log(req.file);
        adminEditSubmit(req.params.id,req.body,img).then(()=>{
      
      res.redirect('/product/Stocks')
   })

   },
   productManage(req,res){
    console.log(req.params.id,req.body.stock);

    productListAndUnlist(req.params.id,req.body.stock).then((response)=>{
        
      res.redirect('/product/Stocks')

    })
   },
   productOffer(req,res){
    
    getAllProduct().then((products)=>{
        
      res.render('adminviews/ProductOffers',{user:false,products})

    })
   },
   addProductOffer(req,res){

    console.log(req.body);
   
    insertProductOffer(req.body).then(()=>{
        
      getProductOffer(req.body).then(()=>{

        res.redirect('/admin/AllOffers')
      })

         
    })



   },
   productDetails(req,res,next){
    let users=req.session.users
    productAllDetails(req.params.id).then((DetailProduct)=>{
      
      res.render('userviews/productDetails',{user:true,DetailProduct,users})
    }).catch(()=>{

    })
},


}