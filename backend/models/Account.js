const db = require('../config/db');
const dbp = require('../config/dbpromise');
const bcrypt = require('bcrypt');

const Account = {
  createAccount: async (accountData, userId, callback) => {
    const { role, email, password, verification_token } = accountData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO Accounts_db (role, email, password, verification_token, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    dbp.query(query, [role, email, hashedPassword, verification_token, userId], callback);
  },

  verifyAccount: (token, callback) => {
    const query = `
      UPDATE Accounts_db SET is_verified = TRUE, verification_token = NULL
      WHERE verification_token = ?
    `;
    dbp.query(query, [token], callback);
  },

  getAccountByEmail: (email, callback) => {
    const query = 'SELECT * FROM Accounts_db WHERE email = ?';
    dbp.query(query, [email], callback);
  },
  
  logLoginHistory: (userId, callback) => {
    const selectQuery = `SELECT * FROM loginhistory WHERE user_id = ?`;
    dbp.query(selectQuery, [userId], (err, results) => {
      if (err) return callback(err);
  
      if (results.length > 0) {
        // User ID exists, so update the timestamp
        const updateQuery = `UPDATE loginhistory SET login_timestamp = NOW() WHERE user_id = ?`;
        dbp.query(updateQuery, [userId], callback);
      } else {
        // User ID does not exist, so insert a new record
        const insertQuery = `INSERT INTO loginhistory (user_id, login_timestamp) VALUES (?, NOW())`;
        dbp.query(insertQuery, [userId], callback);
      }
    });
  },
  getProfilePicture: (userId, callback) => {
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
};

module.exports = Account;
