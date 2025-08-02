const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not defined in your .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

module.exports = mongoose.connection;