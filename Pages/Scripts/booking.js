const restaurantName = window.location.pathname.split('/')[2];

console.log(restaurantName)
  axios.get(`/Restaurants/${restaurantName}`).then((response) => {
    // handle the response here
  //  console.log("the responose from the bookign is "+ JSON.stringify(response.data));
    document.querySelector('.card-icon').innerHTML=` <img src="/uploads/${response.data.rest.imgs}" alt="Burger" />`
    document.querySelector('.card-name').innerHTML = response.data.rest.name
   
    response.data.times.forEach(element => {
        console.log(element.time)
        
        document.getElementById('times').innerHTML+=`<option value="${element.time}">${element.time}</option>`
        
    });
    const Avalaible= response.data.times
    const times = document.getElementById('times')
     times.addEventListener('change',()=>{
      console.log(`avaiable is ${JSON.stringify(Avalaible)}`)
      selected = document.getElementById('times').value
     
     for (let index = 0; index < Avalaible.length; index++) { 
      console.log('Avalaible.length:'+Avalaible[index].time)
       if(Avalaible[index].time==selected){
        console.log(`selected is ${Avalaible[index].time} and have ${Avalaible[index].emptySeats}`) 
        document.getElementById('seats').innerHTML=``
        for (let j = 1; j <= Avalaible[index].emptySeats; j++) {
          document.getElementById('seats').innerHTML+=`<option value="${j}">${j}</option>`
          
        }

       }
      
     } 
    
    document.getElementById('seats-div').style=`display: flex;` 
  })
  }).catch((error) => {
    console.log(error);
  }); 

  function Ehgz(){
    let seats = document.getElementById('seats').value
    let time = document.getElementById('times').value
    
    data= {
        restaurantName,
        seats,
        time

    }
    
    console.log(data)
    axios.post('/Booking', data)
    .then((response) => {
      console.log(response.data)
      if(response.data=='ok'){
    msg = document.getElementById('msg').innerHTML=`
    <div class="card-info" >
                <h3 style= Color:green;>Successful ! </h3>
                
                <p>Time: ${ data.time} </p>
                <p>Seats: ${data.seats} </p>
                
                
                
                
              </div>
    `} 
    else{
           msg = document.getElementById('msg').innerHTML=`
        <div class="card-info" >
                    <h3 style= "Color:red;">Failed! </h3>
                    <p style="Color:red;">  ${response.data}</p>
                    
               
                    
                    
                    
                    
                  </div>
        `
    }
      // Handle the response from the server as needed
    }) 
    .catch((error) => {
     
    })
    

  }


// function initialize(){
  // const Avaliable_Seats = 
// }