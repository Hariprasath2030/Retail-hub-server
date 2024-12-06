const express = require('express');
const { getProductByBarcode, updateProductQuantity } = require('../controllers/BarProductController');

const router = express.Router();
const app = express();
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

router.get('/scan', async (req, res) => {
  const barcode = req.query.barcode; // Example, you can adjust as needed

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

// Routes
app.get('/api/products/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    const product = await Product.findOne({ barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
});

app.patch('/api/products/decrement/:barcode', async (req, res) => {
  const { barcode } = req.params;
  const product = await Product.findOne({ barcode });

  if (product && product.quantity > 0) {
    product.quantity -= 1;
    await product.save();
    res.status(200).json(product);
  } else {
    res.status(400).json({ message: 'Product is out of stock or not found.' });
  }
});
module.exports = router;
