// Backend/models/LoginHistory.js
const db = require('../config/dbpromise'); // Assuming you have a db config file

exports.createLoginHistory = (user_id, success, callback) => {
  const query = 'INSERT INTO loginhistory (user_id, success) VALUES (?, ?)';
  db.query(query, [user_id, success], callback);
};
