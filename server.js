// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

// Import the authRoute or authRouter module
const authRoute = require('./routes/authRoute'); // Adjust the filename if needed
const productRoutes = require('./routes/productRoutes'); 
const customerRoutes = require('./routes/customerRoute');
const billProductRoutes = require('./routes/billproduct');// Import the product routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/products', productRoutes);
app.use('/api/customer',customerRoutes);
app.use('/api/billproduct',billProductRoutes); // Use product routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
