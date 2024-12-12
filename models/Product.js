const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  barcodeId: { 
    type: String,
    required: [true, 'Product ID is required'],
    unique: true
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

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
