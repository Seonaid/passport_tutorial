module.exports = function(app, passport){

	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true // allow flash messages (which is where we sent back the info about the email being registered)

	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages (which is where we sent back the info about the email being registered)

	}));

	app.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage')});
	});

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
			res.render('profile.ejs', {user: req.user});
	});

// authenticate with facebook (if you are not already logged in)
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'})); 
	// 'scope' is where you set what you are going to ask from from Facebook. This says, "please send back the email address".
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

// connecting facebook to existing login
	app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

// connecting twitter to existing login
	app.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));
	app.get('/connect/twitter/callback', passport.authorize('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

// connecting local account to existing login with facebook or twitter	

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

// logging out

	app.get('/logout', function(req, res){
			req.logout();
			res.redirect('/');
	});
};


function isLoggedIn(req, res, next){
	if (req.isAuthenticated())
		return next();
	 res.redirect('/');
}