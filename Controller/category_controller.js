const {respons, response}=require('express');

const {getAllcategory,AddCategorys,adminCategoryEdit,CategoryEdit,removeCategory,filterByCategory,getCategory,InsertCategoryOffer,makeCategoryOffer}=require('../Model/category-helpers')

module.exports={

categoryPage(req,res,next){
     
    getAllcategory().then((getcategory)=>{
        

      res.render('adminviews/adminCategory',{user:false,getcategory})
    })
    
   },
   addCategory(req,res,next){

     

    res.redirect('/category/Category')
   
 },
 addedCategory(req,res,){
     
    AddCategorys(req.body).then((addcategory)=>{

      res.redirect('/category/Category')
      
    }).catch((error)=>{
      
      getAllcategory().then((getcategory)=>{
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
      
    CategoryEdit(req.params.id,req.body).then(()=>{

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
    InsertCategoryOffer(req.body).then((catoffer)=>{
    
     makeCategoryOffer(req.body).then(()=>{

      
      res.redirect('/admin/AllOffers')
     })

    })
  }

}