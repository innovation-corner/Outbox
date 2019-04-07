const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    user_name: { type: String },
    email: { 
        type: String,
        unique: true, 
        required: true, 
        lowercase: true, 
        trim: true, 
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
    },
    first_name:  { type: String },
    last_name:  { type: String },
    brand_name:  { type: String },
    phone_number:  { type: String },
    got_to_know_us:  { type: String },
    user_image: { type: String, default: 'https://via.placeholder.com/150' },
    referrer:  { type: String },
    password: { type: String },
    account_type: { type: String, enum: ['brand', 'influencer'] }, // influencer, brand
    
    facebook_provider: { type: { id: String, token: String }, select: false },
    google_provider: { type: { id: String, token: String }, select: false },
    resetPasswordToken: String,
    resetPasswordExpires: Number
},{
    usePushEach: true
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
	// get access to the user model
	const user = this;
	// generate a salt then run callback
	bcrypt.genSalt(10, function (err, salt) {
		if (err) { return next(err); }
		// hash (encrypt) our password using the salt
		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) { return next(err); }
			// overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

// userSchema.statics.EncryptPassword = async function(password) {
//   const hash = await bcrypt.hash(password, 10);
//   return hash;
// };

userSchema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) { return callback(err); }
		return callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);
