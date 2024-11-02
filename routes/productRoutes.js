// routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product'); // Adjust the path as necessary
const router = express.Router();

// Validate product input
const validateProductInput = (data) => {
  const { userId, productName, productQuantity, price } = data;
  if (!userId || !productName || productQuantity < 0 || price < 0) {
    return false; // Validation failed
  }
  return true; // Validation succeeded
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products: ' + err.message });
  }
});

// Add new product
router.post('/', async (req, res) => {
  if (!validateProductInput(req.body)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { userId, productName, productQuantity, price } = req.body;
  const product = new Product({ userId, productName, productQuantity, price });

  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error saving product: ' + err.message });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  if (!validateProductInput(req.body)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { userId, productName, productQuantity, price } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { userId, productName, productQuantity, price },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product: ' + err.message });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting product: ' + err.message });
  }
});

module.exports = router;