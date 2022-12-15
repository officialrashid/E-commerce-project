const {doadminSignup,getAllusers,adminadd,getAllproduct,adminedit,adminEditsubmit,removeProduct,AddCategorys,getAllcategory,CategoryEdit,adminCategoryEdit,removeCategory}=require('../Model/admin-helpers')
const {respons}=require('express');
const { Result } = require('express-validator');
module.exports={

    adminlogin(req,res,next){
          
        res.render('adminviews/adminlogin');
         
    },
    adminRegisterd(req,res,next){

        doadminSignup(req.body).then((adminData)=>{
            
            console.log(adminData);
            res.render('adminviews/admindashboard',{user:false})

        }).catch((error)=>{

            res.render('adminviews/adminlogin')
        })
    },
    AllUsers(req,res,next){
          
     getAllusers().then((users)=>{
      
        res.render('adminviews/adminAllUsers',{users,user:false})
     })
        
    },
   Stocks(req,res,next){
    
    getAllproduct().then((products)=>{
     
        res.render('adminviews/adminStocks',{user:false,products})
    })
   


   },
   AddProduct(req,res,next){
    
   
    res.render('adminviews/AddProduct',{user:false})
    
   },

   AddedProduct(req,res,next){
    
        var image=req.files.Image
        console.log(req.body);
        adminadd(req.body).then((data)=>{
          console.log(req.file);
          image.mv('./public/Product-images/'+data.id+'.jpg',(err,done)=>{
            if(err){
              console.log(err);
    
            }else{
              res.redirect('/admin/Stocks')
            }
          })
        }).catch((err)=>{
          console.log(err);
        })

    
   },
   editproduct(req,res){

    let productid=req.params.id
    adminedit(productid).then((product)=>{
      
      res.render('adminviews/EditProduct',{user:false,product})
    })
   },

   editsubmit(req,res){

  
    adminEditsubmit(req.params.id,req.body).then(()=>{

      res.redirect('/admin/Stocks')
    })
   },

   deleteproduct(req,res){

    let deleteid=req.params.id
    removeProduct(deleteid).then((response)=>{

      res.redirect('/admin/Stocks')
    })
   },

   Categorypage(req,res,next){
     
    getAllcategory().then((getcategory)=>{
        

      res.render('adminviews/adminCategory',{user:false,getcategory})
    })
    
   },
   addcategory(req,res,next){

     AddCategorys(req.body).then((addcategory)=>{

      res.redirect('/admin/Category')
     })
   },
   EditCategory(req,res,next){
     
    let categoryid=req.params.id
    adminCategoryEdit(categoryid).then((categoryEdit)=>{

      res.render('adminviews/EditCategory',{user:false,categoryEdit})
    })
    

   },
   EditCategorySubmit(req,res,next){
      
     CategoryEdit(req.params.id,req.body).then(()=>{

      res.redirect('/admin/Category')
     })
   },

   DeleteCategory(req,res){
    
    let deleteCategoryid=req.params.id
      
    removeCategory(deleteCategoryid).then((response)=>{
      
      res.redirect('/admin/Category')
    })
    
   }
}