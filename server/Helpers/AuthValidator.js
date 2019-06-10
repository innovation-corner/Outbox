const 
    Joi = require('joi'),
    FormatPhoneNumber = require('../Helpers/FormatPhoneNumber');



module.exports = { 
    async SignupValidator(req, res, next) {
        const schema = Joi.object().keys({
            firstname: Joi.string()
                .min(2)
                .required(),
            lastname: Joi.string()
                .min(2)
                .required(),
            email: Joi.string()
                .email({ minDomainAtoms: 2 })
                .required(),
            brandname: Joi.string()
                .min(2)
                .required(),
            phonenumber: Joi.string()
                .min(6)
                .max(11)
                .required(),
            password: Joi.string()
                .min(8)
                .required(),
            gottoknowus: Joi.string()
                .min(5)
                .max(15)

        }).with('email', 'password');

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            req.flash('error', `${error.details[0].message}`);
            return res.redirect('back');
        }
        else {
            return next(); 
        }
    },
    async SignupInfValidator(req, res, next) {
        const schema = Joi.object().keys({
            firstname: Joi.string()
                .min(2)
                .required(),
            lastname: Joi.string()
                .min(2)
                .required(),
            email: Joi.string()
                .email({ minDomainAtoms: 2 })
                .required(),
            phonenumber: Joi.string()
                .min(6)
                .max(11)
                .required(),
            password: Joi.string()
                .min(8)
                .required(),
            referrer: '' || Joi.string()
                .min(6)
                .max(6),
            gottoknowus: Joi.string()
                .min(5)
                .max(15)

        }).with('email', 'password');

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            console.log({error})
            req.flash('error', `${error.details[0].message}`);
            return res.redirect('back');
        }
        // else if (req.body.phonenumber) {// we might want to allow other cell number than the regular nigerian number
        //     let formatedNumber = FormatPhoneNumber.formatNumber(req.body.phonenumber);
        //     if (formatedNumber.length > 14 ) {
        //         req.flash('error', `Please provide a valid phone number,  too long.`);
        //         return res.redirect('back');
        //     } 
        //     else if(formatedNumber.length < 14 ) {
        //         req.flash('error', `Please provide a valid phone number,  too short.`);
        //         return res.redirect('back');
        //     }
        // }
        else {
            return next(); 
        }
    },
    async LoginValidator(req, res, next) {
        const schema = Joi.object().keys({
            email: Joi.string()
                .email({ minDomainAtoms: 2 })
                .required(),
            password: Joi.string()
                .min(8)
                .required()
        }).with('email', 'password');

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            req.flash('error', `${error.details[0].message}`);
            return res.redirect('back');
        }
        else {
            return next();
        }
    },
    async ResetPassValidator(req, res, next) {
        const schema = Joi.object().keys({
            password: Joi.string()
                .min(8)
                .required(),
            confirmPassword: Joi.string()
                .min(8)
                .required()
        }).with('password', 'confirmPassword');

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            req.flash('error', `${error.details[0].message}`);
            return res.redirect('back');
        }
        else if (req.body.password !== req.body.confirmPassword) {
            console.log("password do not match");
            req.flash('error', `Passwords do Not Match`);
            return res.redirect('back');
        }
        else {
            return next();
        }
    },
    async ForgotPassValidator(req, res, next) {
        const schema = Joi.object().keys({
            email: Joi.string()
                .email({ minDomainAtoms: 2 })
                .required(),
        });

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
            req.flash('error', `${error.details[0].message}`);
            return res.redirect('back');
        }
        else {
            return next();
        }
    }

};