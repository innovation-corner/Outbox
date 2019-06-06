'use strict'

if (process.env.NODE_ENV != 'production') {
	require('dotenv').config();
};


const 
  createError = require('http-errors'),
  express = require('express'),
  favicon = require('serve-favicon'),
  path = require('path'),
  fs = require('fs'),
	_ = require('lodash'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	toastr = require('toastr'),
  compression = require('compression'),
  morgan = require('morgan'),
	helmet = require('helmet'), 
	passport = require('passport'),
	methodOverride = require('method-override'),
  logger = require('morgan');


const app = express();

//DB connection
require('./models').connect(process.env.MONGO_URI, {
  useMongoClient: true
});

require('./services/passport-local');

app.use(compression({filter: shouldCompress})); //This helps to compress responses for all requests

function shouldCompress (req, res) {
	if (req.headers['x-no-compression']) {
		// don't compress responses with this request header
		return false
	}
	// fallback to standard filter function
	return compression.filter(req, res)
};


app.use(helmet()); // Helmet helps to secure express apps by setting HTTP headers
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
	  mongooseConnection: mongoose.connection
	})
}));
app.use(methodOverride("_method"));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.toastr = toastr;
	res.locals._ = _;

	next();
});


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
	flags: 'a'
});
app.use(morgan('combined', { stream: accessLogStream }));


require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

module.exports = app;



//TODO 
// use DEBUG
// return error with callstack: new Error("error message...")