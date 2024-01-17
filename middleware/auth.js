const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to verify JWT and get user information
const auth = async (req, res, next) => {
  try {
    // Extract token from the request header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ msg: 'Access denied. Token not provided.' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user information from the decoded token
    const user = await User.findById(decoded.id).select('-password');

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ msg: 'User not found.' });
    }

    // Attach user information to the request object
    req.user = user;

    // Continue with the next middleware
    next();
  } catch (error) {
    // Handle invalid token
    return res.status(401).json({ msg: 'Invalid token.' });
  }
};

module.exports = auth;
