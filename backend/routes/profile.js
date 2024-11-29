// routes/profile.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming you have a User model

// Middleware to authenticate the user via JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from Authorization header
  if (!token) return res.sendStatus(401); // If no token, send Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, send Forbidden
    req.user = user;
    next();
  });
};

// Get user profile (authenticated route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Assuming JWT contains the user's ID
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user); // Send back user profile data
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { first_name, last_name, email, phone_number, birthdate, gender, address } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the user's profile fields
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.phone_number = phone_number;
    user.birthdate = birthdate;
    user.gender = gender;
    user.address = address; // Assuming you have an address field

    await user.save(); // Save updated profile
    res.json(user); // Return updated profile
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
