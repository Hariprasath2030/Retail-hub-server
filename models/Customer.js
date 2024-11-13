const mongoose = require('mongoose');

// Define the customer schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, default: 'customer' }, // Default role is 'customer'
    phone: { type: String, required: [true, 'Phone number is required'] }, // Optional field, add if required
    address: { type: String, required: [true, 'Address is required'] } // Optional field, add if required
});

// Export the Customer model
module.exports = mongoose.model('Customer', customerSchema);
