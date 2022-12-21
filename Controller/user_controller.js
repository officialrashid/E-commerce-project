const {doSignup,doLogin,ShowProduct,productAlldetails,getCategory,filterByCategory,AddTOCART,getAllCartProducts,changeProductQuantity,removeCartItems,getCartTotalAmount}=require('../Model/user-helpers');
const {respons}=require('express');
const session = require('express-session');

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
    doLogin(req.body).then((user)=>{
       console.log(user);
        
       req.session.loggedIn=true;
       req.session.users=user
       
  
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
           req.session.users=userdata
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
    }).catch(()=>{
      
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
  }).catch(()=>{

  })


    
  }).catch(()=>{

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
  AddtoCart(req,res){
     
    users=req.session.users
    AddTOCART(req.params.id,req.session.users._id).then(()=>{

       res.json({status:true})
    }).catch(()=>{

    })
  },
  CartPage(req,res){
   let users=req.session.users
    let products=getAllCartProducts(req.session.users._id).then((products)=>{
     
      getCartTotalAmount(req.session.users._id).then((Total)=>{
      console.log(products);
      res.render('userviews/CartPage',{user:true,products,users,Total})

      
    }).catch(()=>{

    })  

    }).catch(()=>{

    })
  },
  changequantity(req,res,next){

          console.log(req.body);
          
     changeProductQuantity(req.body).then((response)=>{
       
       res.json(response)
      //  res.redirect('/CartPage')

     }).catch(()=>{

     })
  },
  removeCartItem(req,res,next){
    console.log(req.body);
    

    removeCartItems(req.body).then((response)=>{
     
      res.json(response)

    }).catch(()=>{

      
    })
  },
  proceedToCheckout:(req,res)=>{

    let users=req.session.users;

      getCartTotalAmount(req.session.users._id).then((Total)=>{
           

        let products=getAllCartProducts(req.session.users._id).then((products)=>{
        res.render('userviews/proceedToCheckout',{user:true,users,Total,products})
        
      })
        }).catch((error)=>{
         

        })
   
    

  },
  PlaceOrder(req,res){

    console.log(req.body);
  }
  
}



