const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/booking');

const path = require('path');  // Don't forget to require path for sending HTML files.
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:8081' })); // Vue app's port
app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);  
app.use('/api/auth', bookRoutes);  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/user', express.static(path.join(__dirname, 'uploads', 'user'))); // Specific route for user uploads
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serve the login page if required
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Adjust path if needed
});
