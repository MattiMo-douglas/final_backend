const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 4500;

// Middleware to parse JSON
app.use(express.json());

// Function to connect to MongoDB databases
const connectDB = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI_ATLAS);
        console.log('Connected to MongoDB Atlas');

    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Set up routes
app.use('/api', userRoutes);
app.use('/api' , productRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
