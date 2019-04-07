const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home/index', { title: 'Promote&Pay' });
});

/* GET About page. */
router.get('/about', (req, res) => {
  res.render('home/about', { title: 'Promote&Pay' });
});

/* GET strategy page. */
router.get('/strategies', (req, res) => {
  res.render('home/strategies', { title: 'Promote&Pay' });
});

/* GET FAQ page. */
router.get('/faq', (req, res) => {
  res.render('home/faq', { title: 'Promote&Pay' });
});

/* GET terms page. */
router.get('/terms', (req, res) => {
  res.render('home/terms', { title: 'Promote&Pay' });
});

/* GET home page. */
router.get('/privacy', (req, res) => {
  res.render('home/privacy', { title: 'Promote&Pay' });
});

module.exports = router;
