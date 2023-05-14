
var signinBtn = document.getElementById("btn-signin");
console.log(' sign in js is initiated')
// Add an event listener to the button
signinBtn.addEventListener("click", function(event) {
    console.log('event occured')
  // Prevent the form from submitting normally
  event.preventDefault();

  // Get the user's email and password from the form
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Call a function to complete the sign-in process
  completeSignIn(email, password);
});

// Define a function to complete the sign-in process
async function completeSignIn(email, password) {
    console.log(`signed in with email : ${email} and passowrd ${password}` )
    
    data = {email, password}
  
        await axios.post('/Sign_in', 
        data ).then((response)=>{
            success =JSON.stringify(response.data.success)
            console.log(success)
            if(!success){
                document.getElementById('form').reset()
                alert(" Email or Passowrd is not correct , Try Again! ")
                
            }
            else{
                window.location.href=response.data.redirectUrl
            }
        })
   
   

    //send information to the server
    // Add your code here to complete the sign-in process, such as sending a request to your server or updating the UI to show that the user is signed in

}
