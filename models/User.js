const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, default: 'user' } // Default role is 'user'
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
