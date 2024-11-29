const db = require('../config/db');
const dbp = require('../config/dbpromise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const User = {
  createUser: (userData, callback) => {
    const { first_name, middle_name, last_name, birthdate, gender, phone_number } = userData;
    const query = `
      INSERT INTO Users_db (first_name, middle_name, last_name, birthdate, gender, phone_number)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    dbp.query(query, [first_name, middle_name, last_name, birthdate, gender, phone_number], callback);
  },
  getProfile: (userId, callback) => {
    try {
      // Query to fetch full user profile by ID
      const query = `
        SELECT first_name, middle_name, last_name, phone_number, gender, birthdate, profile_picture
        FROM users_db
        WHERE user_id = ?
      `;
      dbp.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching profile:', err);
          return callback({ status: 500, message: 'Error fetching profile' });
        }
  
        if (results.length === 0) {
          return callback({ status: 404, message: 'User not found' });
        }
  
        // Return user's profile data, including profile picture path
        callback(null, results[0]);
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      callback({ status: 500, message: 'Failed to retrieve profile' });
    }
  },

  updateProfile: (userId, profileData, callback) => {
    const { first_name, middle_name, last_name, phone_number, gender, birthdate, profile_picture } = profileData;
    console.log('Received profile data:', profileData); // Debug log

    // Fetch the current profile picture before updating
    User.getProfile(userId, (err, user) => {
      if (err) {
        return callback(err); // Handle errors from fetching the user profile
      }

      // Prepare filename for the new profile picture (if provided)
      let filename = profile_picture;
      console.log('Profile picture filename:', filename); // Debug log

      // If the profile picture is updated and it's different from the current one, delete the old image
      

      // Prepare the query to update the user profile
      const query = `
        UPDATE users_db
        SET first_name = ?, middle_name = ?, last_name = ?, phone_number = ?, gender = ?, birthdate = ? 
        ${filename ? ', profile_picture = ?' : ''}  
        WHERE user_id = ?
      `;

      const queryValues = [
        first_name,
        middle_name,
        last_name,
        phone_number,
        gender,
        birthdate,
        userId
      ];

      // If a new profile picture filename is provided, add it to the query values
      if (filename) {
        queryValues.splice(6, 0, filename); // Insert filename before userId
      }

      // Execute the query
      dbp.query(query, queryValues, (err, results) => {
        if (err) {
          console.error('Error updating profile:', err);
          return callback({ status: 500, message: 'Error updating profile' });
        }

        callback(null, { message: 'Profile updated successfully' });
      });
    });
  },
};

module.exports = User;
