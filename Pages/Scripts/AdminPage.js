axios.get('/Restaurants').then((response)=>{
    console.log(response.data)
    cards = document.getElementById('gridd')
    cards.innerHTML=''
    response.data.forEach((restaurant)=>{
      cards.innerHTML+=`
      <a href="/EditOwner/${restaurant.name}" id="EditButt"> 
      <div class="resturant-status">
          <div class="reservation-image">
              <image  src="/uploads/${restaurant.imgs}" alt="Restaurant image" class="resturant-image">

              </image>
          </div>
          <div class="restName">
          <strong >${restaurant.name}</strong>
          </div>
          <div class="status-stat">
              <p>Status:<span class="${restaurant.status}"> ${restaurant.status}</span></p>
          </div>

      </div></a>
`
console.log('success')
    })
})
