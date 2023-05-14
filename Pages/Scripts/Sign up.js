var signBtn = document.getElementById("btn-signup"); 

signBtn.addEventListener("click", function(event) {
    console.log('event occured')
  // Prevent the form from submitting normally
  event.preventDefault();

  // Get the user's email and password from the form
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var name = document.getElementById('name').value
  var phone = document.getElementById('phone').value

  // Call a function to complete the sign-in process
  completeSign(email, password,name,phone);
});
async function completeSign(email, password,name,phone) {
    console.log(`signed in with email : ${email} and passowrd ${password} and phone ${phone}` )
    
    data = {email, password,name,phone}
  
        await axios.post('/Sign_up', 
        data ).then((response)=>{
            success =JSON.stringify(response.data.success)
            console.log(success)
            if(!success){
                document.getElementById('form').reset()
                alert(" Try Again! ")
                
            }
            else{
                window.location.href=response.data.redirectUrl
            }
        })
   
   

    //send information to the server
    // Add your code here to complete the sign-in process, such as sending a request to your server or updating the UI to show that the user is signed in

}