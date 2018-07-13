var express = require('express');

var path = require('path');

var favicon = require('serve-favicon');

var logger = require('morgan');

// app objext
var app = express();

// requires the dot env package which reads the env file properly
require('dotenv').config();

// mysql test and setup
var db = require('../db/db');
var dbBuilder = require('../db/init').test();
var dbBuilder = require('../db/init').build();

// importing ( extra code ) for authentication system
require('./authentication').init(app);

// importing ( extra code ) for templating system
require('./templating')(app);

app.use(logger('dev'));

// setting up request routing
require('./routes').init(app);

module.exports = app;
