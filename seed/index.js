const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
  console.log("Database connected");
})

const random = arr=> arr[Math.floor(Math.random()* arr.length)];


const seedDB = async ()=> {
  await Campground.deleteMany({});
  for(let i=0; i< 300 ; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const seed = new Campground({
      author: '66aa74c91a89f8f0c80c4a11',
      title: `${random(descriptors)} ${random(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque minus obcaecati quia magni aut? Sint voluptas, asperiores, placeat eum id odit libero at totam iste nihil molestiae impedit, dolore saepe?',
      price,
      geometry: {
        type: "Point",
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/duhbamdvf/image/upload/v1722617781/YELP-CAMP/waprxw9nzuvov1zdavpc.jpg',
          filename: 'YELP-CAMP/waprxw9nzuvov1zdavpc'
        }
      ]
    })
    await seed.save();
  }
}

// this is only to seed data, so we close the DB connection with the help of the promise.then below.
seedDB().then(()=>{
  mongoose.connection.close();
})


