const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const {storage } = require('../cloudinary')
const multer = require('multer') // v1.0.5
const upload = multer({ storage }) // for parsing multipart/form-data


router.route('/')
  .get( catchAsync(campgrounds.showAll))  
  .post( isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgrounds.saveNew))
  

router.get('/new', isLoggedIn, campgrounds.renderNewForm )

router.route('/:id')
  .get( catchAsync(campgrounds.show))
  .put( isLoggedIn, isAuthor, upload.array('images'), catchAsync(campgrounds.saveEdit))
  .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.delete))


router.get('/:id/edit',  isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;