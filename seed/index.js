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
  for(let i=0; i<50 ; i++){
    const seed = new Campground({
      title: `${random(descriptors)} ${random(places)}`,
      location: `${random(cities).city} ${random(cities).state}`,
      image: `https://picsum.photos/600/400?random=${Math.random()}`,  
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque minus obcaecati quia magni aut? Sint voluptas, asperiores, placeat eum id odit libero at totam iste nihil molestiae impedit, dolore saepe?',
      price: Math.floor((Math.random()*20)+ 10),
      author: '66aa74c91a89f8f0c80c4a11'
    })
    await seed.save();
  }
}

// this is only to seed data, so we close the DB connection with the help of the promise.then below.
seedDB().then(()=>{
  mongoose.connection.close();
})


