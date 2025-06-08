const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// POST: Add new product
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
