const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')


router.route('/')
  .get( catchAsync(campgrounds.showAll))  
  .post( isLoggedIn, validateCampground, catchAsync(campgrounds.saveNew))
  

router.get('/new', isLoggedIn, campgrounds.renderNewForm )

router.route('/:id')
  .get( catchAsync(campgrounds.show))
  .put( isLoggedIn, isAuthor, catchAsync(campgrounds.saveEdit))
  .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.delete))


router.get('/:id/edit',  isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;