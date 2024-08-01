const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews')

// ADD A REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.saveNew))

// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete)) 

module.exports = router;
