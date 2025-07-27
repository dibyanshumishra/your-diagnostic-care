const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}

mongoose
.connect(`${config.get(mongoUri)}/your-diagnostic-care`)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

module.exports = mongoose.connection;
