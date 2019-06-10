'use strict';

// Add access to the app and db objects to each route
module.exports = app => {
  app.use('/', require('./homeRoutes'));
  app.use('/auth', require('./authRoutes'));
  app.use('/ctrl/admin', require('./admin')); // mount the sub app
  app.use('/account', require('./userDashboard'));
};