const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const Address = require('../models/Address');
const Account = require('../models/Account');
const LoginHistory = require('../models/LoginHistory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   // Step 1: Check if the account exists
//   Account.getAccountByEmail(email, (err, result) => {
//     if (err || !result || result.length === 0) {
//       return res.status(400).send('Account does not exist.');
//     }

//     const account = result[0]; // Assuming `result` is an array with the account data.

//     // Step 2: Verify password
//     bcrypt.compare(password, account.password, (err, isMatch) => {
//       if (err || !isMatch) {
//         return res.status(400).send('Invalid password.');
//       }

//       // Step 3: Generate JWT Token
//       const token = jwt.sign({ user_id: account.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//       Account.getUserById(account.user_id, (error, user) => {
//         if (error || !user) {
//           console.error('Error fetching user details:', error);  // Add this line
//           return res.status(500).json({ message: 'Error retrieving user details.' });
//         }


//       res.status(200).json({
//         message: 'Login successful',
//         token: token,
//         user: {
//           name: `${user.first_name} ${user.middle_name} ${user.last_name}`,  // Full name of the user
//           email: account.email,  // User's email
//         },
//       });
//     });
//     });
//   });
// };


exports.login = (req, res) => {
  const { email, password } = req.body;

  // Step 1: Check if the account exists
  Account.getAccountByEmail(email, (err, result) => {
    if (err || !result || result.length === 0) {
      return res.status(400).send('Account does not exist.');
    }

    const account = result[0];

    // Step 2: Verify password
    bcrypt.compare(password, account.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).send('Invalid password.');
      }

      // Step 3: Generate JWT Token
      const token = jwt.sign({ user_id: account.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Step 4: Log login history
      Account.logLoginHistory(account.user_id, (logError) => {
        if (logError) {
          console.error('Failed to log login history:', logError);
          return res.status(500).json({ message: 'Error logging login history.' });
        }

        // Step 5: Retrieve user details and profile
        Account.getProfilePicture(account.user_id, (err, user) => {
          if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).json({ message: 'Error fetching profile' });
          }
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          // Step 6: Send response with user details and profile information
          res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
              role: account.role, // Include the role in the response
              name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
              email: account.email,
              profile_picture: user.profile_picture, // Include profile picture in response
              userid: account.user_id,
            },
          });
        });
      });
    });
  });
};


// Log login attempts








exports.register = (req, res) => {
  const { first_name, middle_name, last_name, birthdate, gender, phone_number, email, password, ...addressData } = req.body;

  // Step 1: Insert User
  User.createUser({ first_name, middle_name, last_name, birthdate, gender, phone_number }, (err, result) => {
    if (err) return res.status(500).send('Error creating user');

    const userId = result.insertId;

    // Step 2: Insert Address
    Address.createAddress(addressData, userId, (err) => {
      if (err) return res.status(500).send('Error creating address');

      // Step 3: Generate Verification Token and Insert Account
      const verificationToken = crypto.randomBytes(32).toString('hex');
      Account.createAccount({ role: 'user', email, password, verification_token: verificationToken }, userId, (err) => {
        if (err) return res.status(500).send('Error creating account');

        // Step 4: Send Verification Email
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // URL to verify the email
        const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Please Verify Your Email Address',
          html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f7f6;
                    padding: 20px;
                  }
                  .email-container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: auto;
                  }
                  .email-header {
                    text-align: center;
                    background-color: #007bff;
                    color: white;
                    padding: 10px;
                    font-size: 24px;
                    border-radius: 10px;
                  }
                  .email-content {
                    margin-top: 20px;
                    font-size: 16px;
                  }
                  .btn-verify {
                    display: inline-block;
                    padding: 12px 30px;
                    font-size: 18px;
                    color: white;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                  }
                  .btn-verify:hover {
                    background-color: #0056b3;
                  }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="email-header">
                    Verify Your Email
                  </div>
                  <div class="email-content">
                    <p>Hello ${first_name} ${last_name},</p>
                    <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
                    <a href="${verificationLink}" class="btn-verify">Verify Email</a>
                    <p>If you did not register for an account, please ignore this email.</p>
                    <p>Best regards,<br>Project Museo Team</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error) => {
          if (error) return res.status(500).send('Error sending email');
          res.status(200).send('User registered. Please check your email for verification link.');
        });
      });
    });
  });
};

// Email Verification Handler
exports.verifyEmail = (req, res) => {
    const { token } = req.query;
  
    Account.verifyAccount(token, (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(400).send('Invalid or expired token');
      }
  
      // Render a success HTML page with the "Login Now" link
      res.status(200).send(`
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              .container {
                margin-top: 50px;
                text-align: center;
              }
              .message-box {
                background-color: #d4edda;
                padding: 30px;
                border-radius: 8px;
                border: 1px solid #c3e6cb;
              }
              .btn-login {
                margin-top: 20px;
                font-size: 16px;
                padding: 10px 20px;
                color: white;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
              }
              .btn-login:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="message-box">
                <h2>Email Verified Successfully!</h2>
                <p>Your email has been verified. You can now log in to your account.</p>
                <a href="http://localhost:8080/login" class="btn-login">Login Now</a>
              </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
          </body>
        </html>
      `);
    });
  };
  
