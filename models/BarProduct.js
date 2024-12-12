const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
});

const productt = mongoose.model('productt', productSchema);

module.exports = productt;