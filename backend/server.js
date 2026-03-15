require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { seedVegetables } = require('./vegetableController');

const start = async () => {
    try {
        console.log('Starting server...');
        
        // Connect to database
        await connectDB();

        const app = express();

        app.use(cors({
            origin: '*', // For production, you can later restrict this to your Render URL
            credentials: true
        }));
        app.use(express.json());

        // Health check route
        app.get('/health', (req, res) => {
            res.status(200).send('Server is running');
        });

        // Routes
        app.use('/api/vegetables', require('./vegetableRoutes'));
        app.use('/api/orders', require('./orderRoutes'));
        app.use('/api/users', require('./userRoutes'));

        // Seed DB
        console.log('Synchronizing vegetables...');
        await seedVegetables();
        console.log('Vegetables synchronized successfully.');

        // Serve frontend static files
        app.use(express.static(path.join(__dirname, '../frontend')));

        // SPA routing - serve index.html for unknown routes
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend/index.html'));
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Fatal initialization error:', error);
        process.exit(1);
    }
};

start();
