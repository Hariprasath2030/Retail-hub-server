const express = require('express');
const { getProductByBarcode, updateProductQuantity } = require('../controllers/BarProductController');
const Product = require('../models/Product');

const router = express.Router();

// POST /scan - Reduce product quantity by 1 after scanning
router.post('/scan', async (req, res) => {
    const { userId } = req.body;
    try {
        const product = await getProductByBarcode(userId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        const updatedProduct = await updateProductQuantity(userId, 1); // Reduce quantity by 1
        res.status(200).json({
          productName: updatedProduct.productName,
          productQuantity: updatedProduct.productQuantity,
          price: updatedProduct.price,
          totalPrice: updatedProduct.price * updatedProduct.productQuantity,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.post('/', async (req, res) => {
  const { userId, productName, price, productQuantity } = req.body;

  try {
    const existingProduct = await Product.findOne({ userId });

    if (existingProduct) {
      // Update quantity if the product already exists
      existingProduct.productQuantity += productQuantity;
      await existingProduct.save();

      return res.status(200).json({ message: 'Product quantity updated', product: existingProduct });
    }

    // Create a new product if it doesn't exist
    const newProduct = new Product({ userId, productName, price, productQuantity });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error adding/updating product', error: err.message });
  }
});


// GET /scan - Retrieve product details by barcode
router.get('/scan', async (req, res) => {
    const userId = req.query.userId;
    try {
        const product = await getProductByBarcode(userId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).json({
            productName: product.productName,
            price: product.price,
            productQuantity: product.productQuantity,
            totalPrice: product.price * product.productQuantity,
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
  const { userId } = req.query; // Extract barcode from query parameters

  if (!userId) {
    return res.status(400).json({ message: 'Invalid request. Barcode query parameter is required. Use the format ?barcode=<value>' });
  }

  try {
    // Find product by barcode
    const product = await Product.findOne({ userId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product); // Return the product details if found
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
});


// PATCH /api/productts/decrement/:barcode - Decrement product quantity by 1
router.patch('/decrement/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const product = await Product.findOne({ userId });
        if (product && product.productQuantity > 0) {
            product.productQuantity -= 1;
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
