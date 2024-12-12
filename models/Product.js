// models/Product.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: [true, 'Product ID is required'],
  },
  productName: { 
    type: String, 
    required: [true, 'Product Name is required'], 
    unique: true, // Ensures that the Product Name is unique
  },
  productQuantity: { 
    type: Number, 
    required: [true, 'Product Quantity is required'], 
    min: [0, 'Quantity must be a positive number'], // Ensures quantity is non-negative
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'], 
    min: [0, 'Price must be a positive number'], // Ensures price is non-negative
  },
});

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
