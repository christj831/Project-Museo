const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const upload = require('../middleware/upload');  // Import the file upload middleware
const path = require('path');

// Profile routes
router.get('/profile', UserController.getProfile);

// Profile update route: Use the upload middleware first and then call the updateProfile method
router.put('/profileupdate', upload.single('profile_picture'), UserController.updateProfile);

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Serve uploaded files (like profile pictures) by defining this route
router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;

  // Determine the correct directory based on filename prefix or other logic
  let directory = '';
  if (filename.startsWith('user-')) {
    directory = 'user';
  }

  const filePath = path.join(__dirname, '..', 'uploads', directory, filename);

  // Send the file to the client
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

router.get('/uploads/user/:filename', (req, res) => {
  const filename = req.params.filename;

  let directory = '';
  if (filename.startsWith('user-')) {
    directory = 'user';
  }

  // Replace backslashes with forward slashes (for Windows compatibility)
  const filePath = path.join(__dirname, '..', 'uploads', directory, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

module.exports = router;
