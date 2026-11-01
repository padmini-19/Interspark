const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate token and set cookie
const generateTokenAndCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true, // Prevents XSS attacks (cannot be accessed via JS)
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    generateTokenAndCookie(res, user._id);

    res.status(201).json({ _id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateTokenAndCookie(res, user._id);
      return res.json({ _id: user._id, email: user.email });
    }
    
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    next(err);
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;