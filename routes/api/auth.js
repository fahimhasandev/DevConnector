const express = require('express');
const auth = require('../../middleware/Auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @routes   GET api/auth
 * @desc     Test Route
 * @access   Public
 *
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); //select will remove the password from it
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @routes   POST api/auth
 * @desc     Authencate user and get token
 * @access   Public
 *
 */

//validating user
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //   How errors.isEmpty() Works
    // 	 true: No errors are present in the errors object.
    // 	 false: There are validation errors in the errors object.
    if (!errors.isEmpty()) {
      // if they are error
      return res.status(400).json({ errors: errors.array() }); //errors.array() Return array of error objects,
    }

    //User Registration
    const { email, password } = req.body;

    try {
      //see if user exists --duplicate email exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(400).send('Server error');
    }
  }
);

module.exports = router;
