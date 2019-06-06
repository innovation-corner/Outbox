const 
	express = require('express'),
	router = express.Router();

    const dashboardController = require('../controllers/userDashboard');
    const middleware = require('../middlewares');

/* GET users listing. */
router.get('/', (req, res) => {
    res.redirect('back')
});

/* GET users listing. */ 
router.get('/dashboard', middleware.isLoggeedIn, dashboardController.GetDashboard);

router.get('/profile', middleware.isLoggeedIn, dashboardController.GetProfile);

module.exports = router;

