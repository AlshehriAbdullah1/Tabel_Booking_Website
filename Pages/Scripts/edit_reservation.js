const reservation_id = window.location.pathname.split('/')[2];
console.log(reservation_id)



function completePage(){
    document.querySelector('.card-name').innerHTML=document.getElementById('rest_name').innerHTML
    // image here =)

}

completePage()

function Ehgz(){
    let seats = document.getElementById('seats').value
    let time = document.getElementById('times').value
    data = {
        seats,time,
        reservation_id
    }
    axios.post('/Edit_Reservation',data).then((response)=>{
        if(response.data=='ok'){
            msg = document.getElementById('msg').innerHTML=`
            <div class="card-info" >
                        <h3 style= Color:green;>Successful ! </h3>
                        
                        <p>Time: ${ data.time} </p>
                        <p>Seats: ${data.seats} </p>
                        
                        
                        
                        
                      </div>
            `
            setTimeout(() => {
                  window.location.href = `/Reservations`
              }, 2000);
         
        } 
            else{
                   msg = document.getElementById('msg').innerHTML=`
                <div class="card-info" >
                            <h3 style= "Color:red;">Failed! </h3>
                            <p style="Color:red;">  ${response.data}</p>
                            
                       
                            
                            
                            
                            
                          </div>
                `

                setTimeout(() => {
                    location.reload()
                }, 2000);
            }

    })
}



axios.get(`/Avaliable_Time/${reservation_id}`).then((response)=>{
    console.log(response.data)
    response.data.forEach(element => {
        console.log(element.time)
        
        document.getElementById('times').innerHTML+=`<option value="${element.time}">${element.time}</option>`
        
    });
    const Avalaible= response.data
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
            console.log(`adding seat ${j}`)
          document.getElementById('seats').innerHTML+=`<option value="${j}">${j}</option>`
          
        }

       }
      
     } 
    
    document.getElementById('seats-div').style=`display: flex;` 
  })
})

cancel = document.getElementById("Cancel-btn")
cancel.addEventListener('click',()=>{
    axios.get(`/Cancel_Reservation/:${reservation_id}`)
    window.location.href = `/Reservations`
})