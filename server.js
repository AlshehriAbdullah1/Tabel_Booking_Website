const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const app = express();
const bodyParser = require("body-parser"); 
const { type } = require('os');
const restaurant = require('./Restaurants')
const nunjucks = require('nunjucks')
const authrize = require('./autherize')
app.use(bodyParser.urlencoded({ extended: false }));
const multer = require('multer');
const fileWriter = require('./fileWriter')
const upload = multer({ storage: multer.memoryStorage() });
nunjucks.configure('Pages',{
  autoescape:true,
  express:app
});

// Parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
// Serve static files from the Public directory
app.use(express.static(path.join(__dirname, 'Pages')));
app.use('/Pages', express.static(path.join(__dirname, 'Pages')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Route for the Home page
app.get('/', (req, res) => {
    console.log(`the id is : ${req.cookies.id}`)
    
    res.sendFile(path.join(__dirname, 'Pages', 'Home', 'home.html'));
  });
app.get('/Restaurants',(req,res)=>{
  restaurant.getAllRestaurants().then((response)=>{
    res.json(response)
  })
 

})
app.get('/home',(req,res)=>{
    console.log('home clicked! ')
    res.redirect('/')

})


// Route for the Sign in page
app.get('/Sign_in', (req, res) => {
    console.log('sign in clicked')
  res.sendFile(path.join(__dirname, 'Pages', 'Sign_in', 'Sign-in.html'));
});

app.get('/Sign_out',(req,res)=>{
  res.clearCookie("id");
  res.clearCookie("Name");
  res.clearCookie("Type");
  res.clearCookie("Signed");

  console.log("sign out clicked! ")
  res.redirect('/Sign_in')
})
app.post("/Sign_in",async(req,res)=>{
    console.log(req.body)
    email = req.body.email 
    pass = req.body.password
    console.log(`the email is ${email} the passowrd is ${pass}`)
    let reply = await restaurant.getSignIN(email,pass)
    console.log(reply)

    //check the db if its correct then make success correct =) 
    const success = true
    if(reply){
     // prepare the cookies and then redirect to the home page
     

     //mock data for account type (removed after finishing the db)
     let type = reply.Type
     res.cookie("id",reply.ID)
     res.cookie("Name",reply.name)
     res.cookie("Type",type)
     res.cookie('Signed',true)

     if(type == "Customer")
     {
      res.json({success,redirectUrl: '/home' })
     }
      else if (type == "Admin")
      {
        res.json({success,redirectUrl: '/Admin_Page' })

      }
      
      else if (type == "Owner")
      {
        res.json({success,redirectUrl: '/Owner_Home_Page' })
      }
      
    }
    else{
      res.write(`data: Incorrect email or passowrd\n\n`);
      //res.send(alert("Incorrect email or passowrd "))
    }
   
})

app.get('/Sign_up',(req,res)=>{
  res.sendFile(path.join(__dirname, 'Pages', 'Sign_up', 'Sign-up.html'))
})

app.post('/Sign_up',async(req,res)=>{
  
 let email=req.body.email
 let password=req.body.password
 let name=req.body.name
 let phone=req.body.phone
  console.log(`the email is ${email} the passowrd is ${password}`)

  //check the db if its correct then make success correct =) 
  const reply = await restaurant.newSignUP(name,email,password,phone)
  console.log(reply)   
  if( reply == "Already exists") {
    success = false
  }
  else {
    success = true 
    
  }

  if(success){
    let type = "Customer"
     res.cookie("id",6)
     res.cookie("Name",name)
     res.cookie("Type",type)
     res.cookie('Signed',true)
    res.json({success,redirectUrl: '/home' })
  }
  else{
    res.json({'success':false})

  }
})
app.get('/AddResturant',(req,res)=>{
    console.log('add res clicked! ')
    res.sendFile(path.join(__dirname, 'Pages', 'AddResturant1', 'AddResturanStep1.html'));
})

app.get('/Menu/:restaurantName',(req,res)=>{
  console.log('menu clicked! ')
  res.sendFile(path.join(__dirname, 'Pages', 'Menu', 'Menu.html'));

})

app.get('/Get_Menius/:restaurantName',async(req,res)=>{
    const restaurantName = req.params.restaurantName; // this should be used as parameter in the function =)  
    try {
      const rest = await restaurant.getRestaurant(restaurantName);
      console.log(rest)
        res.json({rest})
    } catch (error) {
      
    }
})

app.get('/Booking/:restaurantName', (req, res) => {
  console.log(req.cookies)
  if(req.cookies.Type=='Customer'){
    const restaurantName = req.params.restaurantName;

  //check if the restaurant name is in the db
  if(true){
    res.sendFile(path.join(__dirname, 'Pages', 'Booking', 'booking.html'));
  }
  }
  else{
    res.redirect('/Sign_in')
  }
  
  
  
});

app.get('/Restaurants/:restaurantName',async (req,res)=>{
  const restaurantName = req.params.restaurantName; // this should be used as parameter in the function =) 


  try {
    const rest = await restaurant.getRestaurant(restaurantName);
    const times = await restaurant.getRestuarnatTimes(restaurantName);
    console.log({rest,times})
    res.json({rest,times})
  } catch (error) {
    res.sendStatus(500);
  }
  
})
app.post('/Booking',async (req,res)=>{
  console.log('Booking clicked! ')
  console.log(req.body)
  if(req.cookies.Signed && req.cookies.Type=='Customer'){
    // can do the booking 

    console.log(req.body)

  let returned= await restaurant.book(req.cookies.id,req.body.restaurantName,req.body.time,req.body.seats,new Date().toLocaleDateString().replace(/\//g, '-'))
  res.send(returned)
  }
  else{
    //cant do the booking
    console.log('did not work')
  }
  //some logic to do the booking// 


  // get rest information from the database =) 

  

})



app.get('/Reservations',async(req,res)=>{
  
 // console.log(authrize.isSigned(req.cookies,'Customer'))
  if(authrize.isSigned(req.cookies,'Customer')){
        console.log('log is correct = )')
       //res.sendFile(path.join(__dirname, 'Pages', 'Reservation', 'Reservation.html'));
       let reservations = await restaurant.Reservation(req.cookies.id)
       console.log(reservations)
       res.render(path.join(__dirname, 'Pages', 'Reservation', 'Reservation.html'),{reservations})
  }else{

  }


})

app.get('/Edit_page/:reservation_id',async(req,res)=>{
    console.log(`you are in editing ${req.params.reservation_id}`)   
    let reservation = await restaurant.getReservation(req.params.reservation_id) 
    //let times = await restaurant.getRestuarnatTimes(reservations.name)
    res.render(path.join(__dirname, 'Pages', 'Edit_page', 'Edit_reservation.html'),{reservation})

})

app.get(`/Avaliable_Time/:reservation_id`,async(req,res)=>{
  let reply  = await restaurant.getRestName(req.params.reservation_id)

  res.json(reply)
})

app.post('/Edit_Reservation',async(req,res)=>{
  console.log(req.body)
  let reservation_id=req.body.reservation_id
  let time = req.body.time
  let seats = req.body.seats
  let returned = await restaurant.editReservation(reservation_id,time,seats)
  res.send(returned)

})

app.get('/Cancel_Reservation/:reservation_id',async(req,res)=>{
      const id = req.params.reservation_id.replace(':',"")

      console.log(id)
        console.log(`reservation canceled  = ${id}`)
       await restaurant.removeReservation(id)
      console.log('redirecting reservation')
      //res.redirect('/Reservations')
      res.status(200)

})






app.get("/Admin_Page" , (req,res)=>{
  res.sendFile(path.join(__dirname, 'Pages', 'Admin_page', 'Admin page.html'));

})


app.post('/Upload_Image', upload.single('file'),async(req,res)=>{
  const { originalname, buffer } = req.file;
  //const {description} = req.body
  const customerId = 1
  //req.cookies.get('id')
   // assuming you're using cookies to store the customer ID
  
  // Generate a unique file name based on the customer ID and the original file name
  const Menu_Type='Appetizer'
  const fileName = `${customerId}-${Menu_Type}-${originalname}`;
  
  try {
    // Write the image data to a file
    await fileWriter.writeFileAsync(`uploads/${fileName}`, buffer);
    
    // Save the file name to the database
    //await restaurant.insertImage(customerId,description.name,description.price, fileName,description.type);
   // await restaurant.insertImage(customerId,"description2",16.9, fileName,'Appetizer');
    
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
})
app.get('/test',(req,res)=>{
  res.sendFile(path.join(__dirname, 'Testing', 't1', 'test_uploading.html'));
});

app.get('/img/:name',async(req,res)=>{
  const name = req.params.name
  response = await restaurant.getImageByName(name)
  console.log(response)
    
 res.send(`<img src="/uploads/${response.img}" alt="Burger" />`)

})


// Yousef // 
app.get("/EditOwner" , (req,res)=>{
  res.sendFile(path.join(__dirname, 'Pages', 'AdminEditOwner', 'EditOwner.html'));

})

app.get('/EditOwner/:restaurantName',(req,res)=>{
  console.log('menu clicked! sadasdas')
  res.sendFile(path.join(__dirname, 'Pages', 'AdminEditOwner', 'EditOwner.html'));

})
app.post('/UpdateStatus',async (req,res)=>{
  const Rstatus = req.body.status
  const Rname = req.body.Rname

  await restaurant.UpdateStatus(Rname,Rstatus)
  res.redirect("/Admin_Page")
})
// End Yousef // 



//Feras // 
// Feras
app.get('/AddResturant',(req,res)=>{
  console.log('add res clicked! ')
  res.sendFile(path.join(__dirname, 'Pages', 'AddResturant1', 'AddResturanStep1.html'));
})

// Feras
app.post('/addRes1', (req,res)=>{
({email, password , name, phone}=req.body)

//check the db if its correct then make success correct =) 
const success = true  

if(success){
  let type = "Owner"
  //  Send the data to the database

  res.redirect('/AddResturant2')
}
console.log(email, password, name, phone)
})

// Feras
app.post('/addRes2', (req,res)=>{
({email, password , name, phone}=req.body)
console.log(req.body)
//check the db if its correct then make success correct =) 
const success = true  

if(success){
  let type = "Owner"
  //  Send the data to the database

  res.redirect('/Owner_Home_Page')
}
// console.log(email, password, name, phone)
})

// Feras
app.get('/AddResturant2',(req,res)=>{
console.log('add res clicked!')
res.sendFile(path.join(__dirname, 'Pages', 'AddResturant2', 'AddResturanStep2.html'));
})

//Feras
app.get("/Owner_Home_Page" , async (req,res)=>{
  
  let reservations = await restaurant.OwnerReservation(req.cookies.id);
  console.log(reservations);
  res.render(path.join(__dirname, 'Pages', 'OwnerHomePage', 'Owner_Home_Page.html'), {reservations});

})

//Feras
app.get("/Owner_Edit_Page" , async (req,res)=>{
  console.log('here =) ')
  let restuanrant = await restaurant.getOwnerRestaurant(2);
  console.log(restuanrant)
  let personalInfo = await restaurant.getOwnerInfo(2);
  console.log(restuanrant);
  console.log(personalInfo);
  res.render(path.join(__dirname, 'Pages', 'OwnerEditPage', 'Owner_Edit_Page.html'), {restuanrant, personalInfo});
  // res.sendFile(path.join(__dirname, 'Pages', 'OwnerEditPage', 'Owner_Edit_Page.html'));
})
// End Feras //

// runing the server on port 3000 
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

