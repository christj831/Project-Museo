const mysql = require('mysql2');  // Use the promise version of mysql2
const dotenv = require('dotenv');
dotenv.config();

// Create a pool or connection using promises
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'project_museo',
});


module.exports = connection;
