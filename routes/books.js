const express = require('express');
const router = express.Router();
const Book = require('../models/book');



// Get all Books
router.get('/v1/book', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Get book by ID
router.get('/v1/book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Create a new Book
router.post('/v1/book', async (req, res) => {
    const { bookTitle, bookAuthor, description } = req.body;
    try {
        const existingBook = await Book.findOne({ bookTitle });
        if (existingBook) {
            return res.status(400).json({ message: 'Book with this bookTitle already exists' });
        }
        const newBook = new Book({ bookTitle, bookAuthor, description });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Update a book by ID
router.post('/v1/book/:id', async (req, res) => {
    const { bookTitle, bookAuthor, description } = req.body;
    try {
        const existingBook = await Book.findOne({ bookTitle });
        if (existingBook && existingBook._id.toString() !== req.params.id) {
            return res.status(400).json({ message: 'Book with this bookTitle already exists' });
        }
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { bookTitle, bookAuthor, description },
            { new: true }
        );
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book by ID
router.delete('/v1/book/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
