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

	app.get('/profile', isLoggedIn, function(req, res){
			res.render('profile.ejs', {user: req.user});
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'})); 
	// 'scope' is where you set what you are going to ask from from Facebook. This says, "please send back the email address".
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

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