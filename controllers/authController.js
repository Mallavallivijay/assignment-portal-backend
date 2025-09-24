const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password required');
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, user.role);
    res.json({
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
// here logout is not implement as jwt is stateless and can be used andimplement on frontend side itself(remember)...

// const logout = asyncHandler(async (req, res) => {
//   // For JWT-based authentication, logout is handled client-side
//   // by removing the token from storage. Server just returns success.
//   res.json({
//     message: 'Logout successful'
//   });
// });

module.exports = { login};
