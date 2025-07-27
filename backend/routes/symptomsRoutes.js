const express = require('express');
const router = express.Router();
const axios = require('axios');

// Infermedica API configuration
const INFERMEDICA_API_URL = process.env.INFERMEDICA_API_URL;
const INFERMEDICA_APP_ID = process.env.INFERMEDICA_APP_ID;
const INFERMEDICA_APP_KEY = process.env.INFERMEDICA_APP_KEY;

// Basic validation for API keys
if (!INFERMEDICA_API_URL || !INFERMEDICA_APP_ID || !INFERMEDICA_APP_KEY) {
    console.error('Infermedica API credentials are not fully defined in environment variables.');
}

// @route   GET /api/symptoms
// @desc    Get all available symptoms from Infermedica API
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${INFERMEDICA_API_URL}/symptoms`, {
            headers: {
                'App-Id': INFERMEDICA_APP_ID,
                'App-Key': INFERMEDICA_APP_KEY,
                'Content-Type': 'application/json'
            },
            params: {
                // You can add parameters here to filter symptoms if needed,
                // e.g., 'sex_filter=male', 'age_filter=30'
            }
        });

        // Map Infermedica's symptom format to your frontend's expected format ({id, name})
        const symptoms = response.data.map(symptom => ({
            id: symptom.id,
            name: symptom.common_name || symptom.name // Prefer common_name if available
        }));

        res.json(symptoms);
    } catch (err) {
        console.error('Error fetching symptoms from Infermedica:', err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            message: 'Failed to fetch symptoms from external API.',
            details: err.response?.data || err.message
        });
    }
});

module.exports = router;