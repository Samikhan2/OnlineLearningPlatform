const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

/**
 * @route POST /api/v1/user
 * @desc Create a new user
 * @access public
 */
router.post(
  '/sign-up',
  [
    check('username', 'Please enter your Full Name.').not().isEmpty(),
    check('email', 'Please enter your Email Address.').isEmail(),
    check('password', 'Please insert characters minimum length 6 maximum length.').isLength({
        min: 6,
        max: 15,
    }),
    check('phone', 'Invalid Phone Number. Must be a number with length 11.').isNumeric().isLength({ min: 11, max: 11 }),
    check('role', 'Invalid role.').isIn(['student', 'teacher', 'administrator']).notEmpty()
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { username, email, password, phone, role} = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: 'User already exists',
        });
      }

      user = new User({
        username,
        email,
        password,
        phone, 
        role
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      
      jwt.sign(
       { payload },process.env.JWTSECRET,
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
          });
        }
        );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
