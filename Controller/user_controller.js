const {doSignup,doLogin,ShowProduct,productAlldetails}=require('../Model/user-helpers');
const {respons}=require('express')

module.exports={

    userlandingpage(req,res,next){

     ShowProduct().then((ShowProducts)=>{

        res.render('userviews/landingpage',{ShowProducts});
     })
    
},
userLoged(req,res){
    doLogin(req.body).then((response)=>{
       console.log(response);
        
  
          res.render('userviews/UserHome',{user:true});
  
       }).catch((error)=>{
        console.log(error);
        res.render('userviews/userlogin and signup',{error:`${error.error}`})
       })
    
},

userRegistered(req,res,next){
    doSignup(req.body).then((userdata)=>{
           console.log(userdata);
        res.render('userviews/UserHome',{user:true});

    }).catch((error)=>{

        res.render('userviews/userlogin and signup',{error:`${error.error}`})
    })
   

},
LoginandSignupButton(req,res,next){

    res.render('userviews/userlogin and signup');
},

productDetails(req,res,next){

    productAlldetails(req.params.id).then((DetailProduct)=>{
     
      res.render('userviews/productDetails',{user:true,DetailProduct})
    })
}




}