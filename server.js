const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1);
    }
})();

// Define Data Schema and Model
const dataSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // User-defined ID
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

// API Endpoints

// Get all data
app.get('/api/data', async (req, res, next) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Add new data
app.post('/api/data', async (req, res, next) => {
    try {
        const { id, name, quantity, price } = req.body;
        const newData = new Data({ id, name, quantity, price });
        await newData.save();
        res.json(newData);
    } catch (error) {
        next(error);
    }
});

// Update product by ID
app.put('/api/data/:id', async (req, res, next) => {
    try {
        const { name, quantity, price } = req.body;
        const updatedData = await Data.findOneAndUpdate(
            { id: req.params.id },
            { name, quantity, price },
            { new: true }
        );
        res.json(updatedData);
    } catch (error) {
        next(error);
    }
});

// Delete product by ID
app.delete('/api/data/:id', async (req, res, next) => {
    try {
        const deletedData = await Data.findOneAndDelete({ id: req.params.id });
        if (!deletedData) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.json(deletedData);
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
