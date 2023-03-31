const {respons, response}=require('express');

const {getAllCategory,addCategorys,adminCategoryEdit,categoryEdit,removeCategory,filterByCategory,getCategory,insertCategoryOffer,makeCategoryOffer}=require('../Model/category-helpers')

module.exports={

categoryPage(req,res,next){
     
  getAllCategory().then((getcategory)=>{
        

      res.render('adminviews/adminCategory',{user:false,getcategory})
    })
    
   },
   addCategory(req,res,next){

     

    res.redirect('/category/Category')
   
 },
 addedCategory(req,res,){
     
  addCategorys(req.body).then((addcategory)=>{

      res.redirect('/category/Category')
      
    }).catch((error)=>{
      
      getAllCategory().then((getcategory)=>{
     res.render('adminviews/adminCategory',{error:`${error.error}`,getcategory,user:false})
    })
  })
   },
   editCategory(req,res,next){
     
    let categoryid=req.params.id
    adminCategoryEdit(categoryid).then((categoryEdit)=>{

      res.render('adminviews/EditCategory',{user:false,categoryEdit})
    })
    

   },
   editCategorySubmit(req,res,next){
      
    categoryEdit(req.params.id,req.body).then(()=>{

     res.redirect('/category/Category')
    })
  },
  deleteCategory(req,res){
    
    let deleteCategoryid=req.params.id
      
    removeCategory(deleteCategoryid).then((response)=>{
      
      res.redirect('/category/Category')
    })
    
   },
   categoryFilter(req,res){

    let users=req.session.user
    let name=req.body;

    console.log(users);
    console.log(name);

    filterByCategory(name).then((ShowProducts)=>{
     
      getCategory().then((getCategoryData)=>{
      
        res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})


      }).catch(()=>{

        res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})
      })
     
    })
  },
  addCategoryOffer(req,res){
 console.log(req.body,"}}}}}}}}}}}}}}}}}}]]");
 insertCategoryOffer(req.body).then((catoffer)=>{
    
     makeCategoryOffer(req.body).then(()=>{

      
      res.redirect('/admin/AllOffers')
     })

    })
  }

}