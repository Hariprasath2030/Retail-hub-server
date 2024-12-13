const express = require('express');
const Product = require('../models/Product'); // Adjust the path as necessary
const router = express.Router();

// Utility function for validating product input
const validateProductInput = (data) => {
  const { userId, productName, productQuantity, price } = data;
  if (!userId || !productName) {
    return { isValid: false, message: 'User ID and Product Name are required.' };
  }
  if (typeof productQuantity !== 'number' || productQuantity < 0) {
    return { isValid: false, message: 'Product Quantity must be a non-negative number.' };
  }
  if (typeof price !== 'number' || price < 0) {
    return { isValid: false, message: 'Price must be a non-negative number.' };
  }
  return { isValid: true };
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
  const validation = validateProductInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const { userId, productName, productQuantity, price, description, image } = req.body;
  const newProduct = new Product({ userId, productName, productQuantity, price, description, image });

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
  const validation = validateProductInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const { productName, productQuantity, price, description, image } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, productQuantity, price, description, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: `Error updating product: ${error.message}` });
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
