const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

// Register
router.route('/register')
  .get( users.registerForm)
  .post( catchAsync(users.register))

// Login 
router.route('/login')
  .get( users.loginForm)
  .post( storeReturnTo,  passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , users.login)

// Logout
router.get('/logout', users.logout)

module.exports = router;
