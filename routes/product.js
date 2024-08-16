const express = require('express');
const router = express.Router();
const Product = require('../models/product');


//  Create a new product

router.post('/newproduct', async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }
        const newProduct = new Product({ name, price, description });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all products


router.get('/getproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Get product by ID


router.get('/getproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product by ID

router.put('/product/:id', async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct && existingProduct._id.toString() !== req.params.id) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Delete a product by ID

router.delete('/product/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a random product

router.get('/getrandomproduct', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) return res.status(404).json({ message: 'No products found' });
        const random = Math.floor(Math.random() * count);
        const product = await Product.findOne().skip(random);
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
