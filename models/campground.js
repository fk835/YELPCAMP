const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')

const ImageSchema = new Schema ({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200');
})

//map-tiler
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: { //map-box
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
  },
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
}, opts);

// map-tiler
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
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
