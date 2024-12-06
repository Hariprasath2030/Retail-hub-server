require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  barcode: String,
  name: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

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


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  