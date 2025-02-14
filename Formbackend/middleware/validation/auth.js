const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// Middleware to check if user is authenticated
exports.isAuth = async (req, res, next) => {

  // Check if authorization header exists
  if (req.headers && req.headers.authorization) {

    // Extract token from the header
    const token = req.headers.authorization.split(' ')[1];

    try {
      // Verify JWT token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
       // Find user by decoded user ID
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!' });
      }

       // Attach user object to request for later use
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') { //invalid token
        return res.json({ success: false, message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') { //session expired
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    res.json({ success: false, message: 'unauthorized access!' });
  }
};