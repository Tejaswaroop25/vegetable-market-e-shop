const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('ERROR: MONGO_URI is not defined.');
            process.exit(1);
        }
        
        // Safety check for production (Render) - check if we are in production
        if ((uri.includes('localhost') || uri.includes('127.0.0.1')) && process.env.NODE_ENV === 'production') {
            console.error('ERROR: Invalid MONGO_URI for production. It appears to be pointing to localhost.');
            console.error('Please update the MONGO_URI in your Render "Environment" settings.');
            process.exit(1);
        }
        
        const maskedUri = uri.replace(/\/\/[^@]+@/, "//****:****@");
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
