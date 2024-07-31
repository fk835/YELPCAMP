module.exports.isLoggedIn = (req, res, next ) =>{
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You need to be logged in!')
    return res.redirect('/login')
  }
  next();
}

// use the storeReturnTo middleware to save the returnTo value from session to res.locals
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}