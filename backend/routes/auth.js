// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const User = require('../models/User');
// const sendEmail = require('../utils/mailer');

// const router = express.Router();

// // Signup Route
// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             console.log(`Signup failed: User with email ${email} already exists.`);
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Generate verification token
//         const verificationToken = crypto.randomBytes(32).toString('hex');
//         const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             verificationToken,
//             verificationTokenExpires,
//         });

//         await newUser.save();

//         // Send verification email
//         const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&id=${newUser._id}`;
//         const message = `
//             <h1>Email Verification</h1>
//             <p>Please verify your email by clicking the link below:</p>
//             <a href="${verificationUrl}">Verify Email</a>
//         `;
//         await sendEmail(email, 'Verify your email', message);

//         console.log(`Signup successful for user: ${name}, email: ${email}`);
//         res.status(201).json({ message: "Signup successful, please check your email to verify your account." });
//     } catch (error) {
//         console.error(`Signup error: ${error.message}`);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });

// // Email Verification Route
// router.get('/verify-email', async (req, res) => {
//     const { id, token } = req.query;

//     try {
//         const user = await User.findOne({
//             _id: id,
//             verificationToken: token,
//             verificationTokenExpires: { $gt: Date.now() },
//         });

//         if (!user) {
//             return res.status(400).json({ message: "Invalid or expired verification link." });
//         }

//         user.isVerified = true;
//         user.verificationToken = undefined;
//         user.verificationTokenExpires = undefined;
//         await user.save();

//         res.status(200).json({ message: "Email verified successfully. You can now log in." });
//     } catch (error) {
//         console.error(`Email verification error: ${error.message}`);
//         res.status(500).json({ message: "Something went wrong during email verification." });
//     }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (!existingUser) {
//             console.log(`Login failed: User with email ${email} doesn't exist.`);
//             return res.status(404).json({ message: "User doesn't exist" });
//         }

//         if (!existingUser.isVerified) {
//             console.log(`Login failed: User with email ${email} is not verified.`);
//             return res.status(400).json({ message: "Email not verified. Please verify your email before logging in." });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
//         if (!isPasswordCorrect) {
//             console.log(`Login failed: Incorrect password for user with email ${email}.`);
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         console.log(`Login successful for user: ${existingUser.name}, email: ${email}`);
//         res.status(200).json({ result: existingUser, token });
//     } catch (error) {
//         console.error(`Login error: ${error.message}`);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS_KEY,
    },
});


router.get('/user', auth, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ name: user.name });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  
// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Try with another email ID.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create a new user with `isVerified` set to false
    const newUser = new User({ email, password: hashedPassword, name, isVerified: false });
    await newUser.save();

    // Generate a verification token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Generate the verification link
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ error: 'Signup successful, but error sending verification email' });
      }
      console.log('Verification email sent:', info.response);
    });

    // Respond with success
    res.status(201).json({ message: 'User created! Verification email sent.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify Email Route
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Redirect to the login page after successful verification
    res.status(200).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=${process.env.CLIENT_URL}/login" />
        </head>
        <body>
          <p>Email verified successfully. Redirecting to the login page in 3 seconds...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Error verifying email' });
  }
});

// Login Route
// Backend: Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        console.log(`Login failed: User with email ${email} doesn't exist.`);
        return res.status(404).json({ message: "User doesn't exist" });
      }
  
      if (!existingUser.isVerified) {
        console.log(`Login failed: User with email ${email} is not verified.`);
        return res.status(400).json({ message: "Email not verified. Please verify your email before logging in." });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
        console.log(`Login failed: Incorrect password for user with email ${email}.`);
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(`Login successful for user: ${existingUser.name}, email: ${email}`);
      res.status(200).json({ result: existingUser, token });
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  

module.exports = router;
