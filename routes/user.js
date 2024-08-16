const express = require('express');
const router = express.Router();
const User = require('../models/user');


//  Create a new user
router.post('/newuser', async (req, res) => {
    const { email, username } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email or username already exists'
            });
        }

        const newUser = new User({ email, username });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Duplicate key error'
            });
        }
        res.status(400).json({ message: err.message });
    }
});

// Get all users
router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Get user by ID
router.get('/getuser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a user by ID
router.put('/user/:id', async (req, res) => {
    const { username } = req.body;

    try {
      
        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.params.id } 
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Another user with this username already exists'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username },
            { new: true, runValidators: true } 
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Delete a user by ID
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a random user
router.get('/getrandomuser', async (req, res) => {
    try {
        const count = await User.countDocuments();
        const random = Math.floor(Math.random() * count);
        const user = await User.findOne().skip(random);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

