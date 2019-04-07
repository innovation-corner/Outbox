const 
    moment = require('moment'),
    passport = require('passport'),
    async = require('async'),
    crypto = require('crypto'),
    Mailer = require('../services/Mailer'), 

    User = require('../models/userModels');

module.exports = {
    GetDashboardIndex(req, res) {
        if(!req.user) {
            res.redirect('/auth/signin')
        }
        else {
            const {account_type} = req.user;

            if(account_type === 'brand'){
                return res.redirect('/account/br/dashboard')
            }
            else {
                return res.redirect('/account/in/dashboard')
            }
        }
    },
    GetLogin(req, res) {
        res.render('auth/signin', { title: 'Express' });
    },
    PostLogin: passport.authenticate('local', {
		successRedirect: '/auth/redirecting',
		failureRedirect: '/auth/signin',
		failureFlash: true,
		successFlash: "Welcome back"
    }),
    GetRegister (req, res) {
        res.render('auth/signup', { title: 'Express' });
    },
    PostRegister: passport.authenticate('local.signup', {
		successRedirect: '/auth/redirecting',
		failureRedirect: '/auth/signup',
		failureFlash: true,
		successFlash: `Welcome to Promote And Pay`
    }),
    GetRegisterInfluencer (req, res) {
        res.render('auth/signup-influencer', { title: 'Express' });
    },
    PostRegisterInfluencer: passport.authenticate('local.signup.inf', {
		successRedirect: '/auth/redirecting',
		failureRedirect: '/auth/signup-inf',
		failureFlash: true,
		successFlash: `Welcome to Promote And Pay`
    }),
    GetFacebookLogin: passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }),
    GetFacebookCallback: passport.authenticate('facebook', {
        successRedirect: '/auth/redirecting',
        failureRedirect: '/auth/signup-inf',
        failureFlash: true
    }),
    GetGoogleLogin: passport.authenticate('google', { 
        scope: ['profile', 'email']
    }),
    GetGoogleCallback: passport.authenticate('google', {
        successRedirect: '/auth/redirecting',
        failureRedirect: '/auth/signup-inf',
        failureFlash: true
    }),
    GetForgotPass(req, res) {
        res.render('auth/forgot-password', { title: 'Express' });
    },
    PostForgotPass(req, res) {
        const { email } = req.body;

        async.waterfall([
            (callback) => {
                User.findOne({ email }, (err, foundUser) => {
                    if (err) {
                        callback(err, null);
                    }
                    else if (!foundUser) {
                        const err = new Error('Oops! User with the given email does not exist');
                        callback(err, false);
                    }
                    else {
                        crypto.randomBytes(20, (err, buf) => {
                            const token = buf.toString('hex');
                            callback(err, foundUser, token)
                        });
                    };
                });
            },
            (user, token, callback) => {
                let expiry = Date.now() + 3600000;
                User
                .findByIdAndUpdate({
                    _id: user._id
                }, {
                    resetPasswordToken: token,
                    resetPasswordExpires: expiry
                }, { // 1 hour
                    upsert: true,
                    new: true
                })
                .exec((err, updatedUser) => {
                    callback(err, updatedUser, token)
                });
            },
            (user, token, callback) => {
                const { email, first_name } = user;
                const mailObject = { 
                    email,
                    username: first_name, 
                    templateName: "forgotpassword", 
                    link: `${process.env.HOST_URL}/auth/reset-pword?reset_token=${token}`
                };

                Mailer.sendMail(mailObject)
                .then((res) => {
                    console.log("EMAIL Sent")
                    console.log('Reset link :', `${process.env.HOST_URL}/auth/reset-pword?reset_token=${token}`); 
                    callback(null, user);
                })
                .catch(err => {
                    console.log("Could not send mail", err)
                    callback(err, null)
                });
            }
        ], (err, result) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            else {
                req.flash('success', `An e-mail has been sent to ${result.email} with further instructions`);
                res.redirect('/auth/forgot-pword');
            }
        });
    },
    GetResetPass(req, res) {
        res.render('auth/reset-password', { reset_token: req.query.reset_token });
    },
    PostResetPass(req, res) {
        const { password } = req.body;
        const { reset_token } = req.query;
        
        try {
            User.findOne({
                resetPasswordToken: reset_token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, (err, user) => {
                if (err) {
                    console.log('INTERNAL_SERVER_ERROR', err);
                    req.flash('error', 'Something went wrong!!')
                    return res.redirect('back')
                } 
                else if (!user) {
                    req.flash('error', 'Reset token is invalid or expired')
                    return res.redirect('back')
                }
                else {   
                    user.resetPasswordExpires = undefined;
                    user.resetPasswordToken = undefined;
                    user.password = password;

                    user.save(async err => {
                        if (err) {
                            console.log("COULD NOT SAVE USER", err.message)
                            req.flash('error', `Something wrong happened`);
                            return res.redirect('back');
                        }
                        const { email, first_name } = user;
                        const mailObject = { 
                            email,
                            username: first_name , 
                            templateName: "passwordresetsuccessful", 
                            link: `${process.env.HOST_URL}/auth/signin`
                        };
                        
                        await Mailer.sendMail(mailObject)
                        .then((res) => console.log("EMAIL Sent"))
                        .catch(err => console.log("EMAIL Sending Failed"));
                        
                        req.flash('success', 'Password Changed Successfully')
                        res.redirect('/auth/signin');
                    });

                };
            });    
        } catch (error) {
            console.log('Something Wrong Happened', error);
        }
    },
    logout (req, res ) {
        req.logout();
        req.flash('success', "Good Bye")
        res.redirect('/');
    }

};