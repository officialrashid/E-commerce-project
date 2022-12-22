const {doadminSignup,getAllusers,adminadd,getAllproduct,adminedit,adminEditsubmit,removeProduct,AddCategorys,getAllcategory,CategoryEdit,adminCategoryEdit,removeCategory,userblock,getAllcategorydropdown,getcategory,adminCategoryAdd,UserOrderDetails,productView}=require('../Model/admin-helpers')
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
    
    getAllcategorydropdown().then((getcategorydropdown)=>{

    res.render('adminviews/AddProduct',{user:false,getcategorydropdown})
    })
    
    
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
    getcategory().then((geteditcategory)=>{

   
     adminedit(productid).then((product)=>{
      
      res.render('adminviews/EditProduct',{user:false,product,geteditcategory})


    })
   
    })
   },

   editsubmit(req,res){

    let id=req.params.id
    adminEditsubmit(req.params.id,req.body).then(()=>{
       
      
          
      res.redirect('/admin/Stocks')
        console.log(req.file);
         if(req.files?.Image){

        let image=req.files.Image
        image.mv('./public/Product-images/'+id+'.jpg')

         
         }  
      
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

     

      res.redirect('/admin/Category')
     
   },
   AddedCategory(req,res,){
     
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
    
   },
   blockmanagement(req,res){

    userblock(req.params.id,req.body.status).then(()=>{
      
      res.redirect('/admin/AllUsers')

    })
   },
   Orders(req,res){
    
    UserOrderDetails().then((UserOrder)=>{

        res.render('adminviews/UserOrders',{user:false,UserOrder})
    })

   },
   adminProductView(req,res){
     
    productView(req.params.id).then((singleOrder)=>{

        res.render('adminviews/OrderProductDetails',{singleOrder,user:false})
    })

   }
}