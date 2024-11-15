const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/productDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

// API Routes

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  const { name, quantity, price } = req.body;
  
  // Basic validation
  if (!name || quantity < 0 || price < 0) {
    return res.status(400).json({ message: 'Invalid product data' });
  }

  try {
    // Check if product already exists
    let product = await Product.findOne({ name: name.toLowerCase() });
    if (product) {
      // Update quantity if it exists
      product.quantity += quantity;
      product = await product.save();
    } else {
      // Create new product
      product = new Product({ name: name.toLowerCase(), quantity, price });
      await product.save();
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
