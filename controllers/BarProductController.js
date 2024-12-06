const Product = require('../models/Product');

const getProductByBarcode = async (barcode) => {
  try {
    const product = await Product.findOne({ barcode });
    return product;
  } catch (err) {
    throw new Error('Error fetching product: ' + err.message);
  }
};

const updateProductQuantity = async (barcode, quantity) => {
  try {
    const product = await Product.findOne({ barcode });
    if (product && product.quantity > 0) {
      product.quantity -= quantity;
      await product.save();
      return product;
    }
    throw new Error('Out of stock');
  } catch (err) {
    throw new Error('Error updating product: ' + err.message);
  }
};

module.exports = { getProductByBarcode, updateProductQuantity };
