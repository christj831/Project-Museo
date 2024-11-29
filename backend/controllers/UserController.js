const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const Address = require('../models/Address');
const Account = require('../models/Account');
const LoginHistory = require('../models/LoginHistory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
// Controller for fetching the logged-in user's profile
exports.getProfile = async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      // Decode the token to extract the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key
      const userId = decoded.user_id; // Assuming the user ID is stored in the token payload
  
      // Fetch user details
      User.getProfile(userId, (err, user) => {
        if (err) {
          console.error('Error fetching user profile:', err);
          return res.status(500).json({ message: 'Error fetching profile' });
        }
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          birthdate: user.birthdate,
          gender: user.gender,
          phone_number: user.phone_number,
          profile_picture: user.profile_picture,
        });
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Failed to retrieve profile' });
    }
  };

  exports.updateProfile = async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
  
      const { first_name, middle_name, last_name, phone_number, gender, birthdate } = req.body;
      let profile_picture = null;
  
      // Check if a file was uploaded
      if (req.file) {
        profile_picture = req.file.filename; // Extract only the filename, not the full path
      }
  
      // Fetch the current profile picture from the database
      User.getProfile(userId, (err, user) => {
        if (err) {
          console.error('Error fetching user profile:', err);
          return res.status(500).json({ message: 'Error fetching profile' });
        }
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        
  
        // Pass the updated data to the model for updating
        User.updateProfile(userId, { first_name, middle_name, last_name, phone_number, gender, birthdate, profile_picture }, (err, result) => {
          if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Error updating profile' });
          }
  
          res.status(200).json({ message: 'Profile updated successfully' });
        });
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  };