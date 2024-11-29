const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Define storage configuration with conditional directory selection
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the file being uploaded is the profile picture based on field name
    const directory = file.fieldname === 'profile_picture' ? './uploads/user' : './uploads/';

    // Ensure the directory exists or create it if it doesn't
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    cb(null, directory); // Set the dynamic directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on current timestamp and file extension
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix;
    cb(null, filename); // Only the filename (without directory) is passed
  }
});

// Create upload instance with file filter for specific image types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  }
});

module.exports = upload;
