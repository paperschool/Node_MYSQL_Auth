
// express server module
var express = require('express');

// request routing
var router = express.Router();

// module with authentication middlware
var auth = require('../authentication/sessions')

var roles = require('../authentication/roles');

var getOptions = function(active,role){

  let options = buildOptions(role);

  if(options.length-1 >= active){

    options[active]['active'] = true;

  } else {

    options[0]['active'] = true;

  }

  return options;

}

var buildOptions = function(role){

  let options = [];

  options.push({ url:'/dash',label:'dash' });
  options.push({ url:'/logout',label:'logout',logout:true });
  if(role === roles.guest.id) return options

  options.splice(1,0,{ url:'/dash/ingredients',label:'ingredients' });
  options.splice(2,0,{ url:'/dash/recipes',label:'recipe' });
  options.splice(3,0,{ url:'/dash/mealplan',label:'mealplan' });
  if(role === roles.user.id) return options

  options.splice(options.length-1,0,{ url:'/dash/users',label:'users' });
  if(role === roles.admin.id) return options

  // NOTHING TO ADD
  if(role === roles.developer.id) return options

}

router.get('/dash*',auth.checkSession(),(req,res,next)=>{
  next();
});

// session role allocation middle ware
router.all('/dash*',auth.checkSession(),(req,res,next)=>{
  // console.log(req.session.passport.user.role)
  req.id   = req.session.passport.user.id;
  req.role = req.session.passport.user.role;
  next();
});

router.get('/dash',(req,res,next)=>{
  res.render('dash', {
      title: 'Dash',
      sidebar : getOptions(0,req.role)
    });
});

var ingredients = require('./ingredients');

router.use(ingredients);

router.get('/dash/ingredients',(req,res,next) => {

  res.render('dash', {
      title: 'Ingredients',
      sidebar : getOptions(1,req.role),
      ingredients : true
    });

  return;

  // DEPRECIATED
  // ingredients.populateScroll(req.id,(err,items) => {
  //
  //   if(err) throw err;
  //
  //   res.render('dash', {
  //       title: 'Ingredients',
  //       sidebar : getOptions(1,req.role),
  //       items   : items,
  //       ingredients : true
  //     });
  //
  // });

});

router.get('/dash/recipes',(req,res,next)=>{
  res.render('dash', {
      title: 'Recipes',
      sidebar : getOptions(2,req.role),
      recipes : true
      // ingredients : true
    });
});

router.get('/dash/mealplan',(req,res,next)=>{
  res.render('dash', {
      title: 'Mealplan',
      sidebar : getOptions(3,req.role)
    });
});

router.get('/dash/users',(req,res,next)=>{
  res.render('dash', {
      title: 'Users',
      sidebar : getOptions(4,req.role)
    });
});

module.exports = router;
