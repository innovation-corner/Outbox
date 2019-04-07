
const 
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/userModels'),
    Mailer = require('./Mailer'),
    BuildEmailList = require('./BuildEmailList');


passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});



passport.use('local', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
  }, (req, email, password, done) => {
  
	User.findOne({ 'email': email }, async (err, user) => {
		if (err) { 
			return done(err); 
		}
		else if (!user) {
			return done(
				null, 
				false, 
				req.flash('error', "User With the Given Email Does Not Exist")
			);
		}
		else {
			await user.comparePassword(password, (err, isMatch) => {
				if (err) { return done(err); };
				if (!isMatch) { 
					return done(
						null, 
						false, 
						req.flash('error', 'Password does not match this account. Forgotten your password? kindly reset it')
					);
				};
					
				return done(null, user);
			});
		};
  	});
}));



passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password', 
	passReqToCallback: true
}, (req, email, password, done) => { 
	
    User.findOne({'email': email}, async (err, user) => {
        if(err){
            return done(err);
        }
        else if(user){
            return done(
                null, 
                false, 
                req.flash('error', 'User with the given email already exist')
            );
        }
        else {
            const newUser = new User();
            newUser.first_name = req.body.firstname;
            newUser.last_name = req.body.lastname;
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.phonenumber = req.body.phonenumber;
            newUser.got_to_know_us = req.body.gottoknowus;
            newUser.brand_name = req.body.brandname;
            newUser.account_type = 'brand'

            const user = await newUser.save();

            const mailObject = {
                username: user.first_name,
                email: user.email,
                templateName: "welcome-brand",
                link: `${process.env.HOST_URL}/auth/signin` 
            };
            
            await Mailer.sendMail(mailObject)
                    .then(res => console.log("Welcome EMAIL Sent"))
                    .catch(err => console.log("Could not send Welcome mail", err));
            
            await BuildEmailList.buildEmailList(newUser)
                .then(response => console.log("Added to mail list"))
                .catch(err => console.log("Mail Error from strategy :", err));
             
            return done(null, user);
        }
    });
}));


passport.use('local.signup.inf', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => { 
	
    User.findOne({'email': email}, async (err, user) => {
        if(err){
            return done(err);
        }
        else if(user){
            return done(
                null, 
                false, 
                req.flash('error', 'User with the given email already exist')
            );
        }
        else {
            const newUser = new User();
            newUser.first_name = req.body.firstname;
            newUser.last_name = req.body.lastname;
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.phonenumber = req.body.phonenumber;
            newUser.got_to_know_us = req.body.gottoknowus;
            newUser.referrer = req.body.referrer;
            newUser.account_type = 'influencer'

            const user = await newUser.save();

            const mailObject = {
                username: user.first_name,
                email: user.email,
                templateName: "welcome-influencer",
                link: `${process.env.HOST_URL}/auth/signin` 
            };
            
            await Mailer.sendMail(mailObject)
                    .then(res => console.log("Welcome EMAIL Sent"))
                    .catch(err => console.log("Could not send Welcome mail", err));
            
            await BuildEmailList.buildEmailList(newUser)
                .then(response => console.log("Added to mail list"))
                .catch(err => console.log("Mail Error from strategy :", err));
                
            return done(null, user);
        }
    });
}));
  