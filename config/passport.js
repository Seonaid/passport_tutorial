var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

console.log("clientID = " + JSON.stringify(configAuth.facebookAuth));

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID : 337039586487565,
		clientSecret: 'f6bdcca3b778e2e8cb46ecaaea0b7a7a',
		callbackURL : 'http://localhost:8080/auth/facebook/callback'

	}, 

	function(token, refreshToken, profile, done) {
		 process.nextTick(function() {
			User.findOne({ 'facebook.id': profile.id}, function(err, user){
				if (err)
					return done(err);

				if (user) { // if the user already exists, return them from the database
					return done(null, user);
				} else { // otherwise, create a new user in the database using the facebook information
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;

					newUser.save(function(err){
						if (err);
							throw err;
						return done(null, newUser);
					});
				}
					

			});
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email', // this is an override of the default, which is username
		passwordField : 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// async User.findOne (this is part of mongoose???) won't fire unless data is sent back
		process.nextTick(function() {
			User.findOne({'local.email' : email}, function(err, user) {
				if(err)
					return done(err);

				// if the email is already registered
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already registered.'));

				} else {
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					// save
					newUser.save(function(err){
						if (err)
							throw err;
							return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) { //callback with email and password from our login form
		User.findOne({'local.email': email}, function(err, user) {
			if (err)
				return done(err);
// Don't use this!!! violates the principle that you should never admit to somebody that they've guessed a username
			if(!user)
				return done(null, false, req.flash('loginMessage', 'Not registered'));

			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'incorrect password'));

			return done(null, user);
		});
	}));
};