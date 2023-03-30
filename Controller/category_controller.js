const {respons, response}=require('express');

const {getAllcategory,AddCategorys,adminCategoryEdit,CategoryEdit,removeCategory,filterByCategory,getCategory,InsertCategoryOffer,makeCategoryOffer}=require('../Model/category-helpers')

module.exports={

Categorypage(req,res,next){
     
    getAllcategory().then((getcategory)=>{
        

      res.render('adminviews/adminCategory',{user:false,getcategory})
    })
    
   },
   addcategory(req,res,next){

     

    res.redirect('/category/Category')
   
 },
 AddedCategory(req,res,){
     
    AddCategorys(req.body).then((addcategory)=>{

      res.redirect('/category/Category')
      
    }).catch((error)=>{
      
      getAllcategory().then((getcategory)=>{
     res.render('adminviews/adminCategory',{error:`${error.error}`,getcategory,user:false})
    })
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

     res.redirect('/category/Category')
    })
  },
  DeleteCategory(req,res){
    
    let deleteCategoryid=req.params.id
      
    removeCategory(deleteCategoryid).then((response)=>{
      
      res.redirect('/category/Category')
    })
    
   },
   categoryfilter(req,res){

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
  AddCategoryOffer(req,res){
 console.log(req.body,"}}}}}}}}}}}}}}}}}}]]");
    InsertCategoryOffer(req.body).then((catoffer)=>{
    
     makeCategoryOffer(req.body).then(()=>{

      
      res.redirect('/admin/AllOffers')
     })

    })
  }

}