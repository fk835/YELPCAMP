const { reviewSchema, campgroundSchema } = require('./schemas');
const Campground = require('./models/campground')
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

// Authentication
module.exports.isLoggedIn = (req, res, next ) =>{
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You need to be logged in!')
    return res.redirect('/login')
  }
  next();
}

// Use the storeReturnTo middleware to save the returnTo value from session to res.locals
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

// Authorization 
module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params
  const campground = await Campground.findById(id)
  if(!campground.author.equals(req.user._id)){
    req.flash('error', 'You cannot edit this!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}
// review auhtorization
module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params
  const review = await Review.findById(reviewId)
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'You cannot delete this!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

// Server side validation with Joi-Schemas for campgrounds
module.exports.validateCampground = (req, res, next)=> {
  const { error } = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

// Server side validation with Joi-Schemas for reviews
module.exports.validateReview = (req, res, next)=> {
  const { error } = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}