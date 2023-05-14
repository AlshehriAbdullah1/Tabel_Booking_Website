// this file is for retriving restaurant informations such as  location , name , logo .etc...

const { restart } = require("nodemon")
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite');
const { response } = require("express");
// Turki
const  dbs = async()=>{
    return await sqlite.open({
            filename: 'EhgzLyDB.db',
            driver: sqlite3.Database,
          })};
//function should be bulit that opens the database and gets all restaurants info

//1
async function getAllRestaurants(){
    let db = await dbs();
    let restaurants = await db.all("SELECT * FROM Restaurants");
    return restaurants;
}

//2
async function getRestaurant(name){
    console.log('get resturant called ')
    let db = await dbs();
    var restaurant = await db.get('SELECT * FROM Restaurants WHERE Name == ?',[name]);
    var restaurantsID = restaurant.ID;
    // console.log(restaurants);
    
    restaurant.menu = {
        Appetizer: await db.all('SELECT * FROM Menu WHERE ID== ? AND Type == "Appetizer"',[restaurantsID])
        ,Main_Dishes:await db.all('SELECT * FROM Menu WHERE ID== ? AND Type == "Main_Dishes"',[restaurantsID])
        ,Dessert:await db.all('SELECT * FROM Menu WHERE ID== ? AND Type == "Dessert"',[restaurantsID])};
     return restaurant;
}


//this function takes the name of the restuanrant then returnes the available times and avaiable seats

//3
async function newSignUP(Name,Email,Password,Phone){

    if(! (getSignIN(Email,Password))){
        console.log("user already exists" + typeof getSignIN(Email,Password));
        return "Already exists";
    }else{
        const db = await dbs();
        const response = await db.run('INSERT INTO Users (name,Email,Type,Password,Phone) VALUES (?,?,"Customer",?,?)',[Name,Email,Password,Phone]);
        console.log("The new sign up is :"+response)
        return response;
    }
}

async function getRestName(Order_id){
    // takes reservation id as input , returns avaliable times 
    let reply = await getReservation(Order_id) 

    return await getRestuarnatTimes(`${reply.name}`)
}

//4
async function getRestuarnatTimes(name){
    let db = await dbs();
    var restaurant = await db.get('SELECT ID FROM Restaurants WHERE Name == ?',[name]);
    var restaurantID = restaurant.ID;
    var availablility = await db.all('SELECT * FROM Booking WHERE ID == ?',[restaurantID]);
    return availablility;

}

async function changeRestuarnatTimes(name,time){
    let db = await dbs();
    var restaurant = await db.get('SELECT ID FROM Restaurants WHERE Name == ?',[name]);
    var restaurantID = restaurant.ID;
    var availablility = await db.get('SELECT available FROM Booking WHERE ID == ? AND time == ?',[restaurantID,time]);
    return availablility;
}
//5
async function book(Costumer_ID,ResturantName,Time,Seats,Date){
        // this one should return a string of two scinarios, (1) => 'ok'           (2) 'The reason of failure'     like 'Number of selected seats are not available' 

        console.log(`id: ${Costumer_ID}     rest name :  ${ResturantName}    time: ${Time} seats:${Seats} `)
        //example
        let db = await dbs();
        // First check the time
        var reservation = await db.get('SELECT * FROM Booking WHERE name == ? AND time == ?',[ResturantName, Time])
        // console.log(reservationTimes.length)
        console.log(reservation)
        // If it has a value then there is a record of a reservation at that time so check seats
        if(reservation){
            // 
            if(reservation.available=='no' || reservation.emptySeats==0 || reservation.emptySeats < Seats){
                return 'Not enough seats';
            }
            else{
                
                let avai = "yes";
                if(reservation.seats == Seats){
                    avai="no"
                }
                
                await db.run('UPDATE Booking SET ID=? ,name= ?,time=?,seats=?,available= ?,emptySeats=? WHERE name == ? AND time == ?',[reservation.ID,ResturantName,Time,Seats,avai,reservation.emptySeats-Seats,ResturantName, Time]);
                await db.run('INSERT INTO ReservationsUser  (UserID,name,time,seats,status,date) VALUES(?,?,?,?,"Pending",?)',[Costumer_ID,ResturantName,Time,Seats,Date]);
            
                return "ok";
            }
        }
        // there is no reservation at that time so insert it to the database directly 
        else{
            return 'erorr';
        }

        //or 
     //   return 'Not enough seats'
}

//6
async function Reservation(Costumer_ID){
    let db = await dbs();
    var reservation = await db.all('SELECT * FROM ReservationsUser WHERE UserID == ?',[Costumer_ID]);
    return reservation;
}




// this method returns the details of a reservation 
//7
async function getReservation(Order_id){
    let db = await dbs();
    var reservation = await db.get("SELECT * FROM ReservationsUser WHERE orderNum == ?",[Order_id]);
    return reservation;
}

//
async function editReservation(Order_id,Time,Seats){

    let db = await dbs();
    var checkReservation = await db.get('SELECT * FROM ReservationsUser WHERE orderNum == ?',[Order_id]);
    if(checkReservation){
        if(checkReservation.status!="Pending"){
            return "This reservation is canceled or completed";
        }
        else{
            var restName = checkReservation.name;
            var checkBooking = await db.get('SELECT * FROM Booking WHERE time == ? AND name == ?',[Time,restName]);
            if(checkBooking.emptySeats < Seats){
                return "Not enough seats";
            }
            else{
                let avai = "yes";
                if(checkBooking.seats == Seats){
                    avai="no"
                }
                await db.run('UPDATE Booking SET seats=?,available= ?,emptySeats=? WHERE name == ? AND time == ?',[Seats,avai,checkBooking.emptySeats-Seats,restName, Time]);

                await db.run('UPDATE ReservationsUser SET time=?,seats=?,orderNum=? WHERE orderNum == ?',[Time,Seats,Order_id,Order_id]);
                return "ok";
            }
        }
    }
    else{
        console.log("There is no reservation with this order number");
        return "There is no reservation with this order number";
    }
}
async function getSignIN(Email,Password){
    const db = await dbs();
    const response = await db.get('SELECT * FROM Users WHERE Email==? AND Password==?',[Email,Password]);
    console.log("The returned signin is :"+response)
    return response;
}
// async function getInfo()
//
async function removeReservation(Order_id){

    let db = await dbs();
    var reservation = await db.get('UPDATE ReservationsUser SET status= "Canceled" WHERE orderNum == ?',[Order_id]);
    return reservation;
}
async function deleteReservation(Order_id){
    let db = await dbs();
    var reservation = await db.get('UPDATE ReservationsUser SET status= "Canceled" WHERE orderNum == ?',[Order_id]);
    return reservation;
}
//customerId,description.name,description.price, fileName,description.type


async function insertImage(customerId, name, price, fileName, type) {
    try {
      const db = await dbs();
      await db.run('INSERT INTO Menu(ID, name, price, img, type) VALUES (?, ?, ?, ?, ?)', [customerId, name, price, fileName, type]);
      return db.lastID;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async function getImageByName(name){
    try {
        const db = await dbs();
        const response = await db.get(`SELECT img FROM Menu WHERE name="${name}"`);
        return response;
      } catch (err) {
        console.error(err.message);
        throw err;
      }
  }
  // Yousef
  async function UpdateStatus(RestName,newStatus){

    let db = await dbs();
    var reservation = await db.get(`UPDATE Restaurants SET status= "${newStatus}" WHERE name == "${RestName}"`);
    return reservation;
}
  //End Yousef

// Feras

async function getRes(name){
    
    return {
        name:'Shawrma',
        discription: 'Classic Chicken Shawrma',
        type:'Arabic',
        status: 'Approved',
        seats: '10',
        location: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2753.7950674997537!2d50.071349749651155!3d26.3601499650127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49e3114137fda3%3A0xa54e0461f7700233!2sHerfy!5e0!3m2!1sen!2ssa!4v1680268444377!5m2!1sen!2ssa',
        menu: {
            Appetizer:[
               {
                name:'item1',
    
                price:'10.59',
                img:'getIMG'
               },
               {
                name:'item2',
    
                price:'10.59',
                img:'getIMG'
               },
               {
                name:'item3',
    
                price:'10.99',
                img:'getIMG'
               }
    
            ],
            Main_Dishes:[
                {
                    name:'item1',
    
                    price:'10.59',
                    img:'getIMG'
                   },
                   {
                    name:'item2',
    
                    price:'10.62',
                    img:'getIMG'
                   },
                   {
                    name:'item3',
    
                    price:'10.63',
                    img:'getIMG'
                   }
            ],
            Dessert:[
                {
                    name:'item1',
    
                    price:'11.59',
                    img:'getIMG'
                   },
                   {
                    name:'item2',
    
                    price:'15.59',
                    img:'getIMG'
                   },
                   {
                    name:'item3',
    
                    price:'13.59',
                    img:'getIMG'
                   }
            ]
    
        }
            };
}



async function OwnerReservation(Owner_ID){
    console.log(`The requested ID is ${Owner_ID}`);
    Reservations = [
        {
            order: '1',
            name: 'Abdullah',
            phone: '0500000000',
            date: '2023-3-3',
            time: '7:00 PM'
        },
        {
            order: '2',
            name: 'Feras',
            phone: '0500000001',
            date: '2023-3-3',
            time: '7:30 PM'
        },
        {
            order: '3',
            name: 'Turki',
            phone: '0500000002',
            date: '2023-3-3',
            time: '6:30 PM'
        },
        {
            order: '4',
            name: 'Yousef',
            phone: '0500000003',
            date: '2023-3-3',
            time: '8:00 PM'
        }
    ]

    return Reservations;
}

// Feras
async function getOwnerRestaurantName(Owner_ID){
    return 'Shawrma';
}

// Feras
async function getOwnerRestaurant(Owner_ID){
    console.log(`The requested ID is ${Owner_ID}`);
    Restaurant = getRes(getOwnerRestaurantName(Owner_ID))

    return Restaurant;
}

// Feras
async function getOwnerInfo(Owner_ID){
    console.log(`The requested ID is ${Owner_ID}`);
    Info = {
        name: `Feras`,
        email:`feras@gmail.com`,
        phone: `0500000001`
    }
    return Info;
}
module.exports= {newSignUP,UpdateStatus,getRes,OwnerReservation,getOwnerRestaurant,getOwnerInfo,getSignIN,getAllRestaurants,getOwnerRestaurantName,changeRestuarnatTimes,getRestaurant,getRestuarnatTimes,book,Reservation,getOwnerRestaurant,getReservation,editReservation,removeReservation,getRestName,insertImage,getImageByName}