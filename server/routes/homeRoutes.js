const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home/index', { title: 'Outbox' });
});

/* GET About page. */
router.get('/about', (req, res) => {
  res.render('home/about', { title: 'Outbox' });
});

/* GET strategy page. */
router.get('/strategies', (req, res) => {
  res.render('home/strategies', { title: 'Outbox' });
});

/* GET FAQ page. */
router.get('/faq', (req, res) => {
  res.render('home/faq', { title: 'Outbox' });
});

/* GET terms page. */
router.get('/terms', (req, res) => {
  res.render('home/terms', { title: 'Outbox' });
});

/* GET home page. */
router.get('/privacy', (req, res) => {
  res.render('home/privacy', { title: 'Outbox' });
});

module.exports = router;
