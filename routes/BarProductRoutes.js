const express = require('express');
const { getProductByBarcode, updateProductQuantity } = require('../controllers/productController');

const router = express.Router();

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

module.exports = router;
