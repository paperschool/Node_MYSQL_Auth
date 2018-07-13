
// hashing / encyrption library
var bcrypt = require('bcrypt')

function init(app){

  var cookieParser = require('cookie-parser');

  app.use(cookieParser());

  // parsing user input from html input forms
  var bodyParser = require('body-parser');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // method that performs simple rule based validation on input
  var validator = require('express-validator');

  app.use(validator())

  // library that stores session information within a mysql database
  // to allow sessions to persist beyond server restart
  var mysql_store = require('express-mysql-session')

  // options for mysql set up
  var options = require('../../db/db').parameters

  // module incharge of creating express like session for later
  // authentication
  var session = require('express-session')

  // module which facilicates persistent storage of sessions
  var sessionStore = new mysql_store(options);

  // associating session library with application
  app.use(session({
    secret : 'qeazrsxtdcyfvugbpiyhubgvcfdxtesud6ri57f6ulygvgcjf',
    resave : false,
    store: sessionStore,
    saveUninitialized : false
    // cookie { secure : true }
  }));

  // Authorisation Section
  // library responsible for authentication verificiation
  var passport = require('passport')

  var LocalStrategy = require('passport-local').Strategy

  // intiialising passport and associating with session libary through
  // application
  app.use(passport.initialize())

  app.use(passport.session())

  passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });

  passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
  // defining the way usernames and passwords are verified
  passport.use(new LocalStrategy(
    (username,password,done) => {

      var db = require('../../db/db');

      db.query('SELECT id,username,password,role FROM tblUsers WHERE username = ?',[username],(err,results,fields) => {

        // catching SQL errors
        if(err) done(err)

        // essentially the user doesnt exists so deny access
        if(results.length === 0)
          done(null,false)
        else {
          // comparing hash of given password with hash within username in
          // database. This method also auto salt/hashes the plaintext
          bcrypt.compare(password,results[0].password.toString(),function(err,response){
              // if comparrison holds allow access
              if(response === true){
                // successful login termination
                return done(null,results[0])
              } else {
                return done(null,false);
              }
          });
        }
      });
    }
  ));

}

module.exports = init
