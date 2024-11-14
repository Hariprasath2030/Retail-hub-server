const Customer = require('../models/Customer'); // Import the Customer model
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
// Customer signup controller
const customerSignup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new customer
        const newCustomer = new Customer({ name, email, password: hashedPassword, phone });
        await newCustomer.save();
        
        res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error in customer signup', error: error.message });
    }
};
// Customer login controller
const customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if customer exists
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        // Compare the password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate a token
        const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({
            message: 'Customer logged in successfully',
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone, // Include phone in response
                role: customer.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in customer login', error: error.message });
    }
};


module.exports = { customerSignup, customerLogin };
