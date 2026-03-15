const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const { seedVegetables } = require('./vegetableController');

// Connect to database
const start = async () => {
    await connectDB();
    
    const app = express();

app.use(cors({
    origin: [
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5501',
        'http://127.0.0.1:5501'
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/vegetables', require('./vegetableRoutes'));
app.use('/api/orders', require('./orderRoutes'));
app.use('/api/users', require('./userRoutes'));

    // Seed DB
    seedVegetables();

    // Serve frontend static files
    app.use(express.static(path.join(__dirname, '../frontend')));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
