const express = require('express');
const Product = require('../models/totalproduct'); // Adjust the path as necessary
const router = express.Router();

// Fetch all products
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add a new product
router.post('/api/products', async (req, res) => {
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
router.delete('/api/products/:id', async (req, res) => {
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

module.exports = router;
