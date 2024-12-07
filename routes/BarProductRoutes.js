const express = require('express');
const { getProductByBarcode, updateProductQuantity } = require('../controllers/BarProductController');
const Product = require('../models/BarProduct');

const router = express.Router();

// POST /scan - Reduce product quantity by 1 after scanning
router.post('/scan', async (req, res) => {
    const { barcode } = req.body;
    try {
        const product = await getProductByBarcode(barcode);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        const updatedProduct = await updateProductQuantity(barcode, 1); // Reduce quantity by 1
        res.status(200).json({
            name: updatedProduct.name,
            quantity: updatedProduct.quantity,
            price: updatedProduct.price,
            totalPrice: updatedProduct.price * updatedProduct.quantity,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.post('/', async (req, res) => {
  const { barcode, name, price, quantity } = req.body;

  try {
    const existingProduct = await Product.findOne({ barcode });

    if (existingProduct) {
      // Update quantity if the product already exists
      existingProduct.quantity += quantity;
      await existingProduct.save();

      return res.status(200).json({ message: 'Product quantity updated', product: existingProduct });
    }

    // Create a new product if it doesn't exist
    const newProduct = new Product({ barcode, name, price, quantity });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error adding/updating product', error: err.message });
  }
});


// GET /scan - Retrieve product details by barcode
router.get('/scan', async (req, res) => {
    const barcode = req.query.barcode;
    try {
        const product = await getProductByBarcode(barcode);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).json({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            totalPrice: product.price * product.quantity,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET /api/productts/:barcode - Fetch product by barcode
// router.get('/', async (req, res) => {
//     const { barcode } = req.params;
//     try {
//         const product = await Product.findOne({ barcode });
//         if (product) {
//             res.json(product);
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving product', error });
//     }
// });
router.get('/', async (req, res) => {
  const { barcode } = req.query; // Extract barcode from query parameters

  if (!barcode) {
    return res.status(400).json({ message: 'Invalid request. Barcode query parameter is required. Use the format ?barcode=<value>' });
  }

  try {
    // Find product by barcode
    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product); // Return the product details if found
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
});


// PATCH /api/productts/decrement/:barcode - Decrement product quantity by 1
router.patch('/decrement/:barcode', async (req, res) => {
    const { barcode } = req.params;
    try {
        const product = await Product.findOne({ barcode });
        if (product && product.quantity > 0) {
            product.quantity -= 1;
            await product.save();
            res.status(200).json(product);
        } else {
            res.status(400).json({ message: 'Product is out of stock or not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

module.exports = router;
