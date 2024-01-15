const jwt = require('jsonwebtoken');

module.exports = function (requiredRole) {
  return function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        msg: 'Authentication required!',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);

      if (decoded.user.role !== requiredRole) {
        return res.status(403).json({
          msg: 'Authorization denied! Insufficient permissions.',
        });
      }
      req.user = decoded.user; 
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({
        msg: 'Invalid token! Authentication failed.',
      });
    }
  };
};
