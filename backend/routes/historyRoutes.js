const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/isLoggedin');
const history = require('../models/history-model');

// @route   POST--> /api/history
// @desc    Save a symptom query and detected disease to user history
router.post('/', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { selectedSymptoms, detectedDisease } = req.body;

    if (!selectedSymptoms || !Array.isArray(selectedSymptoms) || selectedSymptoms.length === 0 || !detectedDisease) {
        return res.status(400).json({ message: 'Invalid history data provided.' });
    }

    try {
        const newHistoryEntry = new history({
            userId: req.user.id, 
            userName: req.user.name,
            userAge: req.user.age,
            userSex: req.user.sex,   
            selectedSymptoms: selectedSymptoms,
            detectedDisease: detectedDisease,
        });
        await newHistoryEntry.save();

        res.status(201).json({ message: 'History saved successfully!', entry: newHistoryEntry });
    } catch (error) {
        console.error('Error saving history:', error.message);
        res.status(500).json({ message: 'Failed to save history.' });
    }
});

// @route   GET /api/history
// @desc    Fetch user's saved history
router.get('/', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        //sorted by newest first
        const userHistory = await history.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(userHistory);
    } catch (error) {
        console.error('Error fetching user history:', error.message);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
});

module.exports = router;
