const express = require('express');
const Product = require('../models/Product'); // Adjust the path as necessary
const router = express.Router();

// Utility function for validating product input
const validateProductInput = (data) => {
  const { barcode, productName, productQuantity, price } = data;
  if (!barcode || !productName || productQuantity < 0 || price < 0) {
    return false; // Validation failed
  }
  return true; // Validation succeeded
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: `Error fetching products: ${err.message}` });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  if (!validateProductInput(req.body)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { barcode, productName, productQuantity, price } = req.body;
  const newProduct = new Product({ barcode, productName, productQuantity, price });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: `Error saving product: ${err.message}` });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { productName, productQuantity } = req.body;
  if (!productName || typeof productQuantity !== 'number') {
    return res.status(400).send('Invalid data');
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, productQuantity },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: `Error deleting product: ${err.message}` });
  }
});

module.exports = router;
