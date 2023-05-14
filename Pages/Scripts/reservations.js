



async function prepareListeners() {
    const Cancel = document.querySelectorAll('#Cancel-btn')
    Cancel.forEach((button) => {
      button.addEventListener('click', (event) => {
        let reservation_id = event.target.getAttribute('data-reservation')
        console.log(`cancelling reservation id : ${reservation_id}`)

        axios.get(`/Cancel_Reservation/:${reservation_id}`).then((response)=>{
          console.log(' deleting done! ')
          location.reload()
        })
           
    //   window.location.href = `/Booking/${restaurantName}`
     // console.log(`the selected restaurant is =) /Booking/${restaurantName}`)
      })
    })
  
  }

  prepareListeners()