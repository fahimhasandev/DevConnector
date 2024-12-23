const express = require('express');
const router = express.Router();

/**
 * @routes   GET api/auth
 * @desc     Test Route
 * @access   Public
 *
 */
router.get('/', (req, res) => {
  res.send('Auth route');
});

module.exports = router;
