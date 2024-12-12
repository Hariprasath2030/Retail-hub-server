const Product = require('../models/Product');

const getProductByBarcode = async (userId) => {
  try {
    const product = await Product.findOne({ userId });
    return product;
  } catch (err) {
    throw new Error('Error fetching product: ' + err.message);
  }
};

const updateProductQuantity = async (userId, productQuantity) => {
  try {
    const product = await Product.findOne({ userId });
    if (product && product.productQuantity > 0) {
      product.productQuantity -= productQuantity;
      await product.save();
      return product;
    }
    throw new Error('Out of stock');
  } catch (err) {
    throw new Error('Error updating product: ' + err.message);
  }
};

module.exports = { getProductByBarcode, updateProductQuantity };
