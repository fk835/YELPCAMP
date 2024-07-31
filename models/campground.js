const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: 
    {
      type: Schema.Types.ObjectId,
      ref: User
    }
  ,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: Review
    }
  ]
});

/* Delete middle-ware that uses a 'mongoose query middle-ware : findOneAndDelete' associated with 'mongoose document 
middle-ware: findByIdAndDelete' to POST run a function. In this case which is to delete all the reviews alongside the
deleted campground */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if(doc){
    await Review.deleteMany({
      _id: 
      {
        $in : doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
