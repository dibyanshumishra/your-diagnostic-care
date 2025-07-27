const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Refering to User-model
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userAge: { 
        type: Number,
        required: true
    },
    userSex: { 
        type: String,
        required: true
    },
    selectedSymptoms: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
        },
    ],
    detectedDisease: { // Storing the single detected disease
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('History', historySchema);