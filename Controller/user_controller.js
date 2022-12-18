const {doSignup,doLogin,ShowProduct,productAlldetails,getCategory,filterByCategory}=require('../Model/user-helpers');
const {respons}=require('express')

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

    userlandingpage(req,res,next){
    
    let users=req.session.users
     ShowProduct().then((ShowProducts)=>{

      getCategory().then((getCategoryData)=>{


        res.render('userviews/landingpage',{user:true,ShowProducts,users,getCategoryData});
      })
    
            
        
     })
    
},
userLoged(req,res){
    doLogin(req.body).then((response)=>{
       console.log(response);
        
       req.session.loggedIn=true;
       req.session.users=req.body.email
       
  
          res.redirect('/');
  
       }).catch((error)=>{
        console.log(error);
        res.render('userviews/userlogin and signup',{error:`${error.error}`})
       })
    
},

userRegistered(req,res,next){
    doSignup(req.body).then((userdata)=>{
           console.log(userdata);
           req.session.loggedIn=true;
           req.session.users=req.body.email
        res.redirect('/');

    }).catch((error)=>{

        res.render('userviews/userlogin and signup',{error:`${error.error}`})
    })
   

},
LoginandSignupButton(req,res,next){

    res.render('userviews/userlogin and signup');
},

productDetails(req,res,next){
    let users=req.session.users
    productAlldetails(req.params.id).then((DetailProduct)=>{
      
      res.render('userviews/productDetails',{user:true,DetailProduct,users})
    })
},

Logout(req,res){
    
    req.session.loggedIn=false;
    req.session.users=null;
    res.redirect('/')
},

// AddtoCart(req,res){
  
//   users=req.session.users
  
//   productAlldetails(req.params.id).then((DetailProduct)=>{
      
//     res.render('userviews/productDetails',{user:true,DetailProduct,users})
//   })
 
 
// },


ShopButton(req,res){
   
  users=req.session.users
  console.log(users);

  ShowProduct().then((ShowProducts)=>{
  
  getCategory().then((getCategoryData)=>{


    res.render('userviews/ShopPage',{user:true,ShowProducts,users,getCategoryData})
  })


    
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
  }
  
}



