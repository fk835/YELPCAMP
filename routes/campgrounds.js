const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');


// Server side validation with Joi-Schemas for campgrounds
const validateCampground = (req, res, next)=> {
  const { error } = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

// CREATE
router.get('/new', isLoggedIn, (req, res)=>{
  res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next)=>{
  const campground = new Campground(req.body.campground)
  await campground.save();
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`campgrounds/${campground._id}`)
}))

// READ
router.get('/', catchAsync(async (req, res, next)=>{
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}))

router.get('/:id', catchAsync(async(req, res, next)=>{
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if(!campground){
    req.flash('error', 'Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground})
}))

// UPDATE
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next)=>{
  const campground = await Campground.findById(req.params.id)
  if(!campground){
    req.flash('error', 'Campground not found!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit',{campground})
}))

router.put('/:id', isLoggedIn, catchAsync(async(req, res, next)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  req.flash('success', 'Successfully upgraded campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

// DELETE
router.delete('/:id', isLoggedIn, catchAsync(async(req, res, next)=>{
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}))

module.exports = router;