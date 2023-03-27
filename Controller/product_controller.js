const {respons, response}=require('express');
const {getAllproduct,getAllcategorydropdown,adminadd,getcategory,adminedit,adminEditsubmit,productListandUnlist,InsertProductOffer,getProductOffer,productAlldetails,getAllProductOffer}=require('../Model/product-helpers');
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
   
    sessioncheck:(req,res,next)=>{
     
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


    Stocks(req,res,next){
    
        getAllproduct().then((products)=>{
         
            res.render('adminviews/adminStocks',{user:false,products})
        })
       
    
    
       },
       AddProduct(req,res,next){
    
        getAllcategorydropdown().then((getcategorydropdown)=>{
    
        res.render('adminviews/AddProduct',{user:false,getcategorydropdown})
        })
        
        
       },
       AddedProduct(req,res,next){
         
        const files = req.files
        console.log(files);
        const fileName = files.map((file)=>{
            return file.filename
        })

        let data=req.body
         data.productImage=fileName
        adminadd(req.body).then((data)=>{

       
              res.redirect('/product/Stocks')
                 
        })

    
   },
   editproduct(req,res){

    let productid=req.params.id
    getcategory().then((geteditcategory)=>{

   
     adminedit(productid).then((product)=>{
      
      res.render('adminviews/EditProduct',{user:false,product,geteditcategory})


    })
   
    })
   },
   editsubmit:async(req,res)=>{

    let id=req.params.id
    let data = req.body
    let img= req.files
  
    
          
      
      
        console.log(req.file);
    adminEditsubmit(req.params.id,req.body,img).then(()=>{
      
      res.redirect('/product/Stocks')
   })

   },
   productManage(req,res){
    console.log(req.params.id,req.body.stock);

    productListandUnlist(req.params.id,req.body.stock).then((response)=>{
        
      res.redirect('/product/Stocks')

    })
   },
   ProductOffer(req,res){
    
    getAllproduct().then((products)=>{
        
      res.render('adminviews/ProductOffers',{user:false,products})

    })
   },
   AddProductOffer(req,res){

    console.log(req.body);
   
    InsertProductOffer(req.body).then(()=>{
        
      getProductOffer(req.body).then(()=>{

        res.redirect('/admin/AllOffers')
      })

         
    })



   },
   productDetails(req,res,next){
    let users=req.session.users
    productAlldetails(req.params.id).then((DetailProduct)=>{
      
      res.render('userviews/productDetails',{user:true,DetailProduct,users})
    }).catch(()=>{

    })
},


}