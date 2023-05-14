
new Promise((resolve, reject) => {
    const cookies = document.cookie.split("; ");
    const result = {};
    cookies.forEach(cookie => {
      const [name, value] = cookie.split("=");
      result[name] = decodeURIComponent(value);
    });
    resolve(result);
  }).then(res => {
    let btn=   document.getElementById('sign')
    if(res.Signed){
        console.log('signed is correct')
     
     btn.href='/Sign_out'
     btn.innerHTML=`<button class="header-button">Sign Out</button>`
   console.log(btn.innerHTML) }
   else{
    console.log('Inside sign in ')
    btn.innerHTML=`<button class="header-button">Sign In</button>`
   }
  }).catch((err)=>{
    console.log(err)
  });
  

axios.get('/Restaurants').then((response)=>{
    console.log(response.data)
    cards = document.getElementById('cards')
    cards.innerHTML=''
    response.data.forEach((restaurant)=>{
      cards.innerHTML+=`
      <div class="card" data-cuisine="${restaurant.Type}">
      <div class="card-icon">
      <img src="/uploads/${restaurant.imgs}" alt="Burger" />
        
      </div>
      <h2 class="card-name">${restaurant.name}</h2>
      <p class="card-description">${restaurant.description}</p>
      <div class="card-rating">
        <a href="#"><span class="card-star">&#9734;</span></a>
      </div>
      <div class="card-buttons">
       <button id="show-menu" class="card-button"  data-restaurant="${restaurant.name}">Show Menu</button>
       
          <button id="book-now" class="card-button" data-restaurant="${restaurant.name}">Book Table</button>
      </div>
    </div>
`
console.log('success')
prepareListeners()
    })

  })
function prepareListeners() {
  const bookNowButtons = document.querySelectorAll('#book-now')
  bookNowButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      let restaurantName = event.target.getAttribute('data-restaurant')
      console.log(`Booking ${restaurantName}`)
     window.location.href = `/Booking/${restaurantName}`
    })
  })
  const ShowMenu= document.querySelectorAll('#show-menu')
  ShowMenu.forEach((Menu)=>{
    console.log('in show menu! ')
    Menu.addEventListener('click',(event)=>{
      let restaurantName = event.target.getAttribute('data-restaurant')
      console.log(`Booking ${restaurantName}`)
     window.location.href = `/Menu/${restaurantName}`
    })
  })
}


const filter = document.querySelector('#filter');

filter.addEventListener('change', () => {
  const filterValue = filter.options[filter.selectedIndex].value;
  console.log("the filtered value is "+filterValue)
  const cards = document.querySelectorAll('.card');
  for (const card of cards) {
    const cuisine = card.dataset.cuisine;
    console.log("the cuisine value is "+cuisine)
    if(filterValue ==''){
      card.style.display = 'flex';
    }
    else if (cuisine === filterValue ) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  }
  
 
});

const search = document.querySelector('.header__search-btn')


search.addEventListener('click', () => {
  const searchValue = document.querySelector('.header__search-input').value;
  const cards = document.querySelectorAll('.card');
  for (const card of cards) {
    const name = card.querySelector('.card-name').textContent;

    if (name.includes(searchValue)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  }
});

const bookNowButton = document.querySelector('.book-now');
bookNowButton.addEventListener('click', () => {
  document.getElementById('cards').scrollIntoView({
    behavior: 'smooth',
  });
});