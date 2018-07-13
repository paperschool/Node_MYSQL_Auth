
var db = require('../../db/db');

var validator = require('express-validator')

var bcrypt = require('bcrypt')

var passport = require('passport')

var auth = require('../authentication/sessions')

function addUser(req,res){

  // method that will ensure inputs are logical and safe
  let valid = validateInputs(req,res)

  if(valid){
    // method that will insert user credentials into database
    insertUser(req,res);

  }

}

function validateInputs(req,res){

  // Additional validation to ensure username is alphanumeric with underscores and dashes
  req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
  req.checkBody('username', 'Nice Try').

  req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
  req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);

  req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");

  req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
  req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);



  const errors = req.validationErrors()

  if(errors){

    res.render('registration', {
      title : 'Registration',
      errors: errors,
      username_error : errors.filter((e,i,a) => e.param === 'username'),
      email_error    : errors.filter((e,i,a) => e.param === 'email'),
      password_error : errors.filter((e,i,a) => e.param === 'password')
    });
    return false;
  }

  return true;


  // return userExists(req.body.username,
  // () => {
  //
  //   res.render('registration', {
  //     title : 'Registration',
  //     errors: [{msg:"Username Taken :("}]
  //   });
  //
  //   return false
  //
  // }, () => {
  //
  //   console.log("User Name Valid")
  //
  //
  //   return true
  //
  //   return emailExists(req.body.email,
  //   () => {
  //
  //     res.render('registration', {
  //       title : 'Registration',
  //       errors: [{msg:"Email currently in use, login?"}]
  //     });
  //
  //     return false
  //   }, () => {
  //     return true
  //   });
  //
  // });

}

function userExists(username,error,success){

  db.query(
    'SELECT * FROM tblUsers WHERE username=?',
    [username],
    (err,results,fields) => {
      if(results && results.length >= 1) error();
      else success()
    }
  )

}

function emailExists(email,error,success){

  db.query(
    'SELECT * FROM tblUsers WHERE email=?',
    [email],
    (err,results,fields) => {
      if(results.length >= 1) error();
      else success()
    }
  )

}

var roles = require('../authentication/roles');

function insertUser(req,res){

  db.query(
    'INSERT INTO tblUsers ' +
    '(username,email,password,role)' +
    'VALUES' +
    '(?,?,?,?)',
    [
      req.body.username,
      req.body.email,
      // calling on the bcrypt hash method
      auth.hashPlainText(req.body.password),
      // setting initial permission level to guest ( until I approve )
      roles.guest.id
    ],
    (err,results,fields) => {

      if(err)
        res.render('registration', {
          title : 'Registration',
          errors: [{msg:"SQL Error"}]
        });

        res.redirect('/');

        // res.render('login', {
        //   title : 'Login',
        //   login_prompt: "Enter Your username and password!"
        // });

        // setUpSession(req,res);

    })

  }

function setUpSession(req,res){

  db.query('SELECT LAST_INSERT_ID() as username',(err,results,fields) => {

    if(err) throw err;

    // const user_id = results[0]

    // this method will invoke the passport serialize middlware
    // creating a session for ony the recently registered username
    req.login(results[0],(err) => {
      // upon a successful serialisation, the user is redirected
      // to the home page
      res.redirect('/');

    })

  })
}


module.exports.addUser = addUser
