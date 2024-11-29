const mysql = require('mysql2/promise');  // Use the promise version of mysql2
const dotenv = require('dotenv');
dotenv.config();

// Create a pool or connection using promises
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'project_museo',
});

connection.then((connection) => {
  console.log('Connected to MySQL database');
}).catch((err) => {
  console.error('Database connection failed:', err);
});

module.exports = connection;
