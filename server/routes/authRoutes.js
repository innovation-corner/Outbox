const 
	express = require('express'),
	router = express.Router();

const 
	auth = require('../controllers/auth'),
	AuthValidator = require('../Helpers/AuthValidator');

/* GET auth index page. */
router.get('/', function(req, res, next) {
	res.send('Auth index'); 
});

/****************************
	Handle signin
    *******************************/
router.get('/signin', auth.GetLogin);
router.post('/signin', AuthValidator.LoginValidator, auth.PostLogin);

/******************************
	Handle signup 
    *******************************/
router.get('/signup', auth.GetRegister);
router.post('/signup', AuthValidator.SignupValidator, auth.PostRegister);

/* Forgot password */
router.get('/forgot-pword', auth.GetForgotPass);
router.post('/forgot-pword', AuthValidator.ForgotPassValidator, auth.PostForgotPass);

/* RESET password */
router.get('/reset-pword', auth.GetResetPass);
router.post('/reset-pword', AuthValidator.ResetPassValidator , auth.PostResetPass);


/* Log user out */ 
router.get('/logout', auth.logout);

module.exports = router; 
