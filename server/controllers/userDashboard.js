const 
    User = require('../models/userModels');


module.exports = {
    GetDashboard: (req, res) => { 
        res.render('dashboard/landing')
    },
    GetProfile: (req, res) => { 
        res.render('dashboard/profile')
    }
}