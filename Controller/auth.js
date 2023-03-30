
const {getUSer}=require('../Model/user-helpers');
module.exports={

    verifyUser:async (req,res,next)=>
    {
        try
        {
            if(req.session.loggedIn)
            {
                
                let user = await getUSer(req.session.users._id)
                console.log(user.isBlocked);
                if(user.isBlocked == false){
                   
                  
                    next()
                  }
                else{

                    req.session.users=null
                   
                    req.session.loggedIn=false

                    res.redirect('/LoginandSignupButton')
                }
              
            }
            else{
                res.redirect('/LoginandSignupButton')
            }
        }
        catch(error)
  {
      res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
  }

        }
        
}