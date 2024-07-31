const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const usersRouter = require('./routes/users')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const app = express()

// DB connection
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
  console.log("Database connected");
})

// Setting engine and directories
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// MIDDLE-WARES
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


// session- config
const sessionConfig = {
  secret: 'keepthisasecret',
  resave: false ,
  saveUninitialized: true ,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

// session middle-ware
app.use(session(sessionConfig))
app.use(flash())

// authenticate
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// local variables accessible everywhere
app.use((req, res, next)=> {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
})

// Route MW's
app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)
app.use('/', usersRouter )

// Home page route handler
app.get('/', (req, res)=>{
  res.render('home')   
})

app.all('*', (req, res, next)=>{
  next(new ExpressError('Page Not Found', 404))
})

// Error middle-ware
app.use((err, req, res, next)=>{
  const {statusCode = 500 } = err;
  if(!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
})

// Port Status
app.listen(3000, ()=>{
  console.log("LISTENING TO PORT 3000!!!")
})