const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('ERROR: MONGO_URI environment variable is not defined.');
            console.error('Please set MONGO_URI in your Render settings or .env file.');
            process.exit(1);
        }
        
        const maskedUri = uri ? uri.replace(/\/\/[^@]+@/, "//****:****@") : 'undefined';
        console.log(`Attempting to connect to MongoDB with URI: ${maskedUri}`);
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        const maskedUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/[^@]+@/, "//****:****@") : 'undefined';
        console.error(`MongoDB Connection Error using URI [${maskedUri}]: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
