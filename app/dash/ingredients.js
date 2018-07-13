// importing database module
var db = require('../../db/db');

// importing express
var express = require('express');

// request routing
var router = express.Router();

// importing utitlity module
var utitlies = require('../utilities')

// this method is called on the page load of the ingredients page
router.post('/dash/ingredients/fetchALL',(req,res,next) => {

  if(req.isAuthenticated()){
    db.query(
      'SELECT * FROM tblIngredients WHERE userid = ?',
      [req.session.passport.user.id],
      (err,results,fields) => {
        if(err) {
          throw err;
          res.send(null)
        }
        res.send(results)
      });
  }
});

// when an ingredient is selected by actual id
router.post('/dash/ingredients/fetchONE',(req,res,next) => {

  // console.log("Single Ingredient Fetch",req.body)

  if(req.isAuthenticated()){
    db.query(
      'SELECT * FROM tblIngredients WHERE id=?',
      [req.body.id],
      (err,results,fields) => {
        if(err) {
          throw err;
          res.send(null)
        }
        res.send(results[0])
    });
  }

});

// when the client requests an update to an existing ingredient
router.post('/dash/ingredients/updateIngredient',(req,res,next) => {

  // if given ingredient object is invalid in terms of data
  // do nothing essentially
  if(!validateIngredient(req.body.ingredient)){

    console.log(" User Ingredient is Invalid ");

    res.send(false);

    return;

  }

  if(req.isAuthenticated()){

    db.query(
      'UPDATE tblIngredients SET ' +
      'name=?,calories=?,fat=?,protein=?,carbohydrates=?,sodium=?,tags=?' +
      'WHERE id=?',
      [
        req.body.ingredient.name || 'default name',
        req.body.ingredient.calories || 0,
        req.body.ingredient.fat || 0,
        req.body.ingredient.protein || 0,
        req.body.ingredient.carbohydrates || 0,
        req.body.ingredient.sodium || 0,
        '',
        req.body.ingredient.id
      ],
      (err,results,fields) => {

        if(err) {
          throw err;
          res.send(false)
        }

        res.send(true)

      });

  }

});

// when the client requests the creation of an ingredient
router.post('/dash/ingredients/createIngredient',(req,res,next) => {

  // if given ingredient object is invalid in terms of data
  // do nothing essentially
  if(!validateIngredient(req.body.ingredient)){

    console.log(" User Ingredient is Invalid ");

    res.send(false)

    return;
  }

  if(req.isAuthenticated()){

    db.query(
      'INSERT INTO tblIngredients ' +
      '(userid,name,calories,fat,protein,carbohydrates,sodium,tags) ' +
      'VALUES ' +
      '(?,?,?,?,?,?,?,?) ',
      [ req.id,
        req.body.ingredient.name || 'default name',
        req.body.ingredient.calories || 0,
        req.body.ingredient.fat || 0,
        req.body.ingredient.protein || 0,
        req.body.ingredient.carbohydrates || 0,
        req.body.ingredient.sodium || 0,
        '' ],
      (err,results,fields) => {

        if(err) {
          throw err;
          res.send(false)
        }

        res.send(true)

      });

  }

});

// when the client requests the creation of an ingredient
router.post('/dash/ingredients/deleteIngredient',(req,res,next) => {

  if(req.isAuthenticated()){

    db.query(
      'DELETE FROM tblIngredients WHERE id=?',
      [ req.body.id ],
      (err,results,fields) => {

        if(err) {
          throw err;
          res.send(false)
        }

        res.send(true)

      });

  }

});

// this method calls specific validation methods on the utility validation
// module and passes in the user given ingredient object
function validateIngredient(ingredient){

  var success = true;

  // TEST ALL INPUTS GIVEN VARIOUS VALIDATIONS
  if(!utitlies.validate([ utitlies.validationTypes.ALPHANUMERIC ],ingredient.name)){
    success = false;
  }

  // if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_FLOAT ],ingredient.grams)){
  //   success = false;
  // }
  //
  // console.log(" GRAMS ",success,ingredient.grams);

  if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_INT ],ingredient.calories)){
    success = false;
  }

  if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_FLOAT ],ingredient.fat)){
    success = false;
  }

  if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_FLOAT ],ingredient.carbohydrates)){
    success = false;
  }

  if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_FLOAT ],ingredient.protein)){
    success = false;
  }

  if(!utitlies.validate([ utitlies.validationTypes.POSITIVE_FLOAT ],ingredient.sodium)){
    success = false;
  }

  return success

}

function populateScroll(id,done) {

  db.query(
    'SELECT * FROM tblIngredients WHERE userid = ?',
    [id],(err,results,fields) => {

    // catching SQL errors
    if(err){
       done(err,null);
       return
    }

    if(results.length === 0) {
      done(null,[]);
      return;
    }

    let items = results.map((e,i,a) => e = { name : e.name } );

    done(null,items);

  });

}

module.exports = router;

module.exports.validateIngredient = validateIngredient;

module.exports.populateScroll = populateScroll;
