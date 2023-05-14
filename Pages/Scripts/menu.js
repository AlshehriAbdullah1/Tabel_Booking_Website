
const url = window.location.href;
const restaurantName = url.substr(url.lastIndexOf('/') + 1);
console.log(`restaurant name is ${restaurantName}`)
axios.get(`/Get_Menius/${restaurantName}`).then(async (response)=>{
    let menu= response.data.rest
  //  console.log(response.data)
    console.log(menu);
    let Name = document.querySelector('.card')
    Name.innerHTML=`     
                     <img src="/uploads/${menu.imgs}" alt="Burger" />
                    <div class="restaurant-name">${restaurantName}</div>`
    let Rating = document.querySelector('.Rating')
    Rating.innerHTML=`
                     <span class="rating-star">&#9733;</span>
                     <div class="rating-value">${menu.rating}</div>` 
    
    let location = document.querySelector('.card-2')
    location.innerHTML = `
                    <iframe src="${menu.Locations}" width="300" height="200" style="border:0;" loading="lazy"></iframe>
                    <button onclick="book()">Book now</button>
    `                     
   
    let Appetizer = document.querySelector('.Appetizer')
    Appetizer.innerHTML= `<div class="menu-category">Appetizer</div>`

    menu.menu.Appetizer.forEach(element => {
        Appetizer.innerHTML +=`<div class="menu-card">
        <div class="menu-card-content">
          <img src="/uploads/${element.img}" alt="Icon" class="menu-card-icon">
          <p class="menu-card-title">${element.name}</p>
          <div class="menu-card-price">${element.price}</div>
        </div>
      </div>`
    });
    let Main = document.querySelector('.Main-Dishes')
    Main.innerHTML = ` <div class="menu-category"><p>Main Dishes</p></div>`
    menu.menu.Main_Dishes.forEach((element)=>{
        Main.innerHTML +=`<div class="menu-card">
        <div class="menu-card-content">
        <img src="/uploads/${element.img}" alt="Icon" class="menu-card-icon">
          <p class="menu-card-title">${element.name}</p>
          <div class="menu-card-price">${element.price}</div>
        </div>
      </div>`
    })

    let dessert = document.querySelector('.Desserts')
    dessert.innerHTML=` <div class="menu-category"><p>Dessert</p></div>`
    menu.menu.Dessert.forEach((element)=>{
        dessert.innerHTML +=`<div class="menu-card">
        <div class="menu-card-content">
        <img src="/uploads/${element.img}" alt="Icon" class="menu-card-icon">
          <p class="menu-card-title">${element.name}</p>
          <div class="menu-card-price">${element.price}</div>
        </div>
      </div>`
    })

   /* `<div class="menu-card">
                <div class="menu-card-content">
                  <img src="/Menu/Assets/Menu-Item.png" alt="Icon" class="menu-card-icon">
                  <p class="menu-card-title">Cheesburger</p>
                  <div class="menu-card-price">9.99 SAR</div>
                </div>
              </div>` */
})

function book(){
    window.location.href=`/Booking/${restaurantName}`
}