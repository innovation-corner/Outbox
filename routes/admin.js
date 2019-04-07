const express = require('express');

const router = express.Router();

/* GET admin page. */
router.get('/', (req, res) => {
  res.redirect('back');
});

module.exports = router;
