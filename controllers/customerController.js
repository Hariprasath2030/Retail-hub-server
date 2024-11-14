const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Customer signup controller
const customerSignup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Basic validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer
        const newCustomer = new Customer({ name, email, password: hashedPassword, phone, role: 'customer' });
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
    } catch (error) {
        console.error('Error in customerSignup:', error);
        res.status(500).json({ message: 'Error in customer signup', error: error.message });
    }
};

const customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Customer logged in successfully',
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: customer.role,
            },
        });
    } catch (error) {
        console.error('Error during customer login:', error); // Log exact error
        res.status(500).json({ message: 'Error in customer login', error: error.message });
    }
};


module.exports = { customerSignup, customerLogin };
