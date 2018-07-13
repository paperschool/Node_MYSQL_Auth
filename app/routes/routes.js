
// express server module
var express = require('express');

// request routing
var router = express.Router();

// authentication library
var passport = require('passport');

// access control hierarchy
var permissions = require('permission')

// useful utilities module
var utils = require('../utilities')

// authenticated pages routing

// page whitelist for publically accessible pages
var whitelist = [
  '/',
  '/home',
  '/login',
  '/registration',
  '/reset'
]

var blacklist = [
  '/dash',
  '/dash/ingredients',
  '/dash/recipes',
  '/dash/mealplans'
]

// using the dash routing module ( just for clarity )
router.use(require('../dash/index'))

/* GET home page. */
router.get(['/','/home','/login'], function(req, res, next) {
  // console.log("User Session: ",req.user,req.isAuthenticated());
  if(req.isAuthenticated()){
    res.redirect('/dash');
  } else {
    res.render('login', { title: 'Login' });
  }
});

// when user requests the registration page
router.get('/registration', function(req, res, next) {
  res.render('registration', { title: 'Registration' });
});


router.get('/reset', function(req, res, next) {

  messages = [
    'Aw Shucks, Shame!',
    'Passwords ay!',
    'Didn\'t you write it down?!',
    'Try your Mothers Maiden Name!',
    'Try your credit card number!',
    'Come back when you know it!!'
  ]

  res.render('reset', {
    recovery_message:  messages[utils.randInt(0,messages.length-1)]
  });

});

router.get('/logout', function(req, res, next) {

  req.logout();

  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/');
  });

});


// POST AREA

// var userlogin = require("../app/userlogin")


router.post('/login',(req,res,next) => {
  passport.authenticate('local',(err,user,info) => {

    // if there was an error
    if(err) return next(err)

    // redirect auth fails
    if(!user) {
      return res.render('login',{login_error : 'Username Password Combination Incorrect'})
    }

    req.logIn(user,(err) => {

      // req.role = user.role;

      // console.log("SESSION",req.session.Passport);

      // if login err
      if(err) return next(err)
      
      return res.redirect('/dash')

    })

  })(req,res,next);

});

// router.post('/login',passport.authenticate(
//   'local',{
//     successRedirect : '/dash',
//     failureRedirect : '/login',
//   })
// );

var usercreation = require("../usercreation")

// when post request made to this page, the user addition
// system will kick off
router.post('/registration',usercreation.addUser);

// exporting module
module.exports = router;
