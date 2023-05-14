


axios.get('/Restaurants').then((response)=>{
    console.log(response.data)
    OName = document.getElementById('OwnerName')
    console.log(window.location.pathname)
     response.data.forEach((restaurant)=>{
        let filePath = `/EditOwner/${restaurant.name}`
        if (window.location.pathname==filePath) {
            OName = document.getElementById('OwnerName')
            OName.value = 'Abdullah Ahmed'

            title = document.getElementById('cardTitle')
            title.innerHTML = restaurant.name


            RName = document.getElementById('RestName')
            RName.value = restaurant.name

            PNum = document.getElementById('PhuneNum')
            PNum.value = '0505050505'

            RType = document.getElementById('Type')
            RType.value = restaurant.Type

            Email = document.getElementById('Email')
            Email.value = 'AbdullahAhmed@Gmail.com'

            
            RDesc = document.getElementById('Discription')
            RDesc.value = restaurant.description

            RStatus = document.getElementById('status')
            RStatus.value = restaurant.status

            cardDesc = document.getElementById('IDDesc')
            cardDesc.innerHTML = restaurant.description
        }


console.log('success')
    })
})

function UpdateSt(){
    RName = document.getElementById('RestName')
    RStatus = document.getElementById('status')
    axios.post('/UpdateStatus',{status:RStatus.value, Rname:RName.value})
    .then((responsee)=>{
        window.location.href = '/Admin_Page'
    })
}