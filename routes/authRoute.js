// Inside your routes file, such as `authRoute.js`
const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const { login } = require('../controllers/authController');
 // Import signup controller

// Define the route for signup
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
