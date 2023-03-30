
        var nameError=document.getElementById('name-error')
        var emailError=document.getElementById('email-error')
        var passwordError=document.getElementById('password-error')
        var confirmpasswordError=document.getElementById('confirmpassword-error')
        var submitError=document.getElementById('submit-error')
        var phoneError=document.getElementById('phone-error')
        function validateName(){
         
            var name=document.getElementById('check-name').value;
        
            if(name.length==0){
                nameError.innerHTML = 'Name is required';
                return false;
            }
            else if(!name.match(/^[A-Za-z]+ [A-Za-z]+$/)){
                nameError.innerHTML ='Write Full Name';
                return false;
            }
            else{
                nameError.innerHTML ='<i class="fa-solid fa-circle-check"></i>';
                return true;
            }
        
            
        }
        function validateEmail(){
        
            var email=document.getElementById('check-email').value;
            if(email.length==0){
                emailError.innerHTML ='Email is required';
                return false;
        
            }
           else if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
                emailError.innerHTML='Email Invalid';
                return false;
            }
            else{
                emailError.innerHTML ='<i class="fa-solid fa-circle-check"></i>';
                return true;
            }
        }
        function validatePassword(){
        
            var password=document.getElementById('check-password').value
        
            var minNumberofChars = 6;
            var maxNumberofChars = 16;
            var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/; 
            if(password.length < minNumberofChars || password.length > maxNumberofChars){
                passwordError.innerHTML='password invalid';
                return false;
            }
            else if(password.length==0){

                passwordError.innerHTML='password is required'
            }
          else if(!regularExpression) {
                passwordError.innerHTML='password should be 6 character or number';
                return false;
            }
            else{
                passwordError.innerHTML ='<i class="fa-solid fa-circle-check"></i>';
                return true;
            }
        }
        function validateConfirmPassword(){
        var password=document.getElementById('check-password').value
          var Confirmpassword=document.getElementById('check-confirmpassword').value;
        
            if(Confirmpassword.length==0){
              
                confirmpasswordError.innerHTML='password is required';
                return false;
            }
            else if(password==Confirmpassword){

                confirmpasswordError.innerHTML ='<i class="fa-solid fa-circle-check"></i>';
                return true;
                
            }
            else{
                confirmpasswordError.innerHTML='check the confirm password';
                return false;
            }
        }
        
        function validatephonenumber(){
         
            var phone=document.getElementById('check-phone').value;
            if(phone.length == 0)
            {
                phoneError.innerHTML="Phone required";
                return false;
            }else
            if(phone.length<10||phone.length>10 )
            {
                phoneError.innerHTML="10 digits required";
                return false;   
            }else
            if(!phone.match(/^[0-9]{10}$/)){
                phoneError.innerHTML="not valid";
                return false; 
            }else
            phoneError.innerHTML='<i class="fa-solid fa-square-check"></i>';
            return true;

        }
        function validateForm(){
        
            var submit =document.getElementById('check-submit').value;
            if(! validateName() || ! validateEmail() || ! validatePassword() || ! validateConfirmPassword() || ! validatephonenumber()){
                submitError.style.display ='block';
                submitError.innerHTML='please fill the form';
                setTimeout(function(){submitError.style.display ='none';},3000);
                return false;
            }
            else{
                return true;
            }
              
        }
           
           // get references to the error message elements
var codeError = document.getElementById('couponCode-Error');
var nameError = document.getElementById('couponName-Error');
var discountError = document.getElementById('couponDiscount-Error');
var startError = document.getElementById('couponStart-Error');
var endError = document.getElementById('couponEnd-Error');
var minimumError = document.getElementById('couponMinimum-Error');
var maximumError = document.getElementById('couponMaximum-Error');
var couponSubmitError = document.getElementById('couponSubmit-Error');

// define the validation functions
function validateCode() {
  var code = document.getElementById('couponCode').value.trim();
  // var regex = /^[a-zA-Z0-9]+$/; // alphanumeric characters only
  if (!code) {
    codeError.textContent = 'Coupon code is required';
    return false;
  // } else if (!regex.test(code)) {
  //   codeError.textContent = 'Coupon code must consist of alphanumeric characters only';
  //   return false;
  } else {
    codeError.textContent = '';
    return true;
  }
}

function validateName() {
  var name = document.getElementById('couponName').value.trim();
  var regex = /^[a-zA-Z]+$/; // letters only
  if (!name) {
    nameError.textContent = 'Coupon name is required';
    return false;
  } else if (!regex.test(name)) {
    nameError.textContent = 'Coupon name must consist of letters only';
    return false;
  } else {
    nameError.textContent = '';
    return true;
  }
}

function validateDiscount() {
  var discount = parseInt(document.getElementById('couponDiscount').value);
  if (!discount || discount < 1) {
    discountError.textContent = 'Discount amount is required and must be a positive integer';
    return false;
  } else {
    discountError.textContent = '';
    return true;
  }
}

function validateStart() {
  var start = new Date(document.getElementById('couponStart').value);
  var end = new Date(document.getElementById('couponEnd').value);

  if (!start) {
    startError.textContent = 'Start date is required';
    return false;
  } else if (end && start > end) {
    startError.textContent = 'Start date must be before the end date';
    return false;
  } else {
    startError.textContent = '';
    return true;
  }
}

function validateEnd() {
  var end = new Date(document.getElementById('couponEnd').value);
  var start = new Date(document.getElementById('couponStart').value);

  if (!end) {
    endError.textContent = 'End date is required';
    return false;
  } else if (start && end < start) {
    endError.textContent = 'End date must be after the start date';
    return false;
  } else {
    endError.textContent = '';
    return true;
  }
}


function validateMinimum() {
  var minimum = parseInt(document.getElementById('couponMinimum').value);
  var maximum = parseInt(document.getElementById('couponMaximum').value);
  if (!minimum || minimum < 1) {
    minimumError.textContent = 'Minimum amount is required and must be a positive integer';
    return false;
  } else if (maximum && minimum > maximum) {
    minimumError.textContent = 'Minimum amount must be less than or equal to Maximum amount';
    return false;
  } else {
    minimumError.textContent = '';
    return true;
  }
}

function validateMaximum() {
  var maximum = parseInt(document.getElementById('couponMaximum').value);
  var minimum = parseInt(document.getElementById('couponMinimum').value);
  if (!maximum || maximum < 1) {
    maximumError.textContent = 'Maximum amount is required and must be a positive integer';
    return false;
  } else if (minimum && maximum < minimum) {
    maximumError.textContent = 'Maximum amount must be greater than or equal to Minimum amount';
    return false;
  } else {
    maximumError.textContent = '';
    return true;
  }
}


// add the validation functions to the form elements
document.getElementById('couponCode').addEventListener('input', validateCode);
document.getElementById('couponName').addEventListener('input', validateName);
document.getElementById('couponDiscount').addEventListener('input', validateDiscount);
document.getElementById('couponStart').addEventListener('input', validateStart);
document.getElementById('couponEnd').addEventListener('input', validateEnd);
document.getElementById('couponMinimum').addEventListener('input', validateMinimum);
document.getElementById('couponMaximum').addEventListener('input', validateMaximum);

// define the submit function
function handleSubmit() {
  if (!validateName() || !validateDiscount() ||!validateStart() ||!validateEnd()||!validateMinimum()||!validateMaximum()||!validateCode() ){
    couponSubmitError.style.display ='block';
    couponSubmitError.innerHTML='please fill the form';
      setTimeout(function(){couponSubmitError.style.display ='none';},3000);
      return false
  } else {
    return true
    }

}
var productSubmitError = document.getElementById('productSubmit-Error');
var productDiscountError = document.getElementById('productDiscount-Error');

function productDiscount() {
  var discount = parseInt(document.getElementById('productDiscount').value);
  if (!discount || discount < 1) {
    productDiscountError.textContent = 'Discount amount is required and must be a positive integer';
    return false;
  } else {
    productDiscountError.textContent = '';
    return true;
  }
}
function productOfferSubmit(){

  if(!productDiscount()){
    productSubmitError.style.display ='block';
    productSubmitError.innerHTML='please fill the form';
      setTimeout(function(){productSubmitError.style.display ='none';},3000);
      return false
  }
  return true
}