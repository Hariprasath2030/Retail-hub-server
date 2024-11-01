// models/Product.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: [true, 'User ID is required'] 
  },
  productName: { 
    type: String, 
    required: [true, 'Product Name is required'], 
    unique: true 
  },
  productQuantity: { 
    type: Number, 
    required: [true, 'Product Quantity is required'], 
    min: [0, 'Quantity must be a positive number']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'], 
    min: [0, 'Price must be a positive number'] 
  },
});

// Export the model
module.exports = mongoose.model('Products', productSchema);



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type : String,
    required: true,
  },
});

const User = mongoose.model('Users', userSchema)
module.exports = User;