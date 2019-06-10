module.exports = {
	isLoggeedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
				req.flash('error', 'Please Login First');
				return res.redirect('/auth/signin');
		}
	}
}