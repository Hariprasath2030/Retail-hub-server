const express = require('express');
const router = express.Router();
const { customerSignup, customerLogin } = require('../controllers/customerController');

// Define the route for customer signup
router.post('/signup', customerSignup);

// Define the route for customer login
router.post('/login', customerLogin);

module.exports = router;
