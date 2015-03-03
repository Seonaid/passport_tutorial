// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration
mongoose.connect(configDB.url) // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application

app.use(morgan('dev')); // log requests to the console
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'somethingmysterious'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// routes

require('./app/routes.js')(app, passport); // load routes and pass in fully configured passport

// launch

app.listen(port);
console.log('listening on port ' + port);