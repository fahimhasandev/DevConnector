const express = require('express');
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @routes   POST api/users
 * @desc     Register Users
 * @access   Public
 *
 */

//sign up user
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //   How errors.isEmpty() Works
    // •	true: No errors are present in the errors object.
    // •	false: There are validation errors in the errors object.
    if (!errors.isEmpty()) {
      // if they are error
      return res.status(400).json({ errors: errors.array() }); //errors.array() Return array of error objects,
    }

    //User Registration
    const { name, email, password } = req.body;

    try {
      //see if user exists --duplicate email exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: [{ msg: 'User alreay Exist' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //create an instance of the user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      //take the password and hash it
      user.password = await bcrypt.hash(password, salt);

      //save the user
      await user.save();

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
