const User = require('../models/user')

module.exports.registerForm = (req, res)=>{
  res.render('users/register')
}

module.exports.register = async (req, res)=>{
  try {
    const { email, username,  password } = req.body;
    const user = new User({ email, username})
    const registeredUser = await User.register(user, password)  
    // for user to directly login once registered
    req.login(registeredUser, (err)=>{
      if(err) {return next(err)}
      req.flash('success', 'Welcome to Yelp camp')
      res.redirect('/campgrounds')
    })
    
  } 
  catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
  }
}

module.exports.loginForm = (req, res)=>{
  res.render('users/login')
}

module.exports.login = (req, res)=>{
  req.flash('success', "You're logged in")
  // gets you back to where loggin is required e.g editing, new i.e. where isLoggedIn is used
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res)=>{
  req.logout(function (err) {
    if (err) {
        return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });

}
