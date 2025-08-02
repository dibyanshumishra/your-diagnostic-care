const express = require('express');
const router = express.Router();
const axios = require('axios');
const { mockDiseases } = require('../src/mockdata');

// Infermedica API configuration from environment variables
const INFERMEDICA_API_URL = process.env.INFERMEDICA_API_URL;
const INFERMEDICA_APP_ID = process.env.INFERMEDICA_APP_ID;
const INFERMEDICA_APP_KEY = process.env.INFERMEDICA_APP_KEY;

if (!INFERMEDICA_API_URL || !INFERMEDICA_APP_ID || !INFERMEDICA_APP_KEY) {
    console.error('Infermedica API credentials are not fully defined in environment variables.');
}

router.post('/', async (req, res) => {
    const { symptomIds, sex, age } = req.body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of symptom IDs.' });
    }
    // Infermedica requires sex and age for diagnosis
    if (!sex || typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ message: 'Sex and a valid Age are required for diagnosis.' });
    }

    // Map selected symptom IDs to Infermedica's evidence format
    const evidence = symptomIds.map(id => ({
        id: id,
        choice_id: 'present' // Assuming all selected symptoms are 'present'
    }));

    try {
        const response = await axios.post(`${INFERMEDICA_API_URL}/diagnosis`, {
            sex: sex,
            age: age,
            evidence: evidence,
        }, {
            headers: {
                'App-Id': INFERMEDICA_APP_ID,
                'App-Key': INFERMEDICA_APP_KEY,
                'Content-Type': 'application/json'
            }
        });

        const infermedicaConditions = response.data.conditions;

        if (infermedicaConditions.length === 0) {
            // If Infermedica returns no conditions, send an empty array
            return res.json([]);
        }

        // Get the top condition (highest probability)
        const topCondition = infermedicaConditions[0];

        // Try to enrich the disease details from our mockDiseases
        const enrichedDisease = mockDiseases.find(d => d.id === topCondition.id);

        const detectedDisease = {
            id: topCondition.id,
            name: topCondition.common_name || topCondition.name,
            description: enrichedDisease?.description || `A potential condition: ${topCondition.common_name || topCondition.name}. Consult a medical professional for more details.`,
            commonSymptoms: enrichedDisease?.commonSymptoms || [],
            riskFactors: enrichedDisease?.riskFactors || [],
            basicTreatment: enrichedDisease?.basicTreatment || 'Consult a medical professional for proper diagnosis and treatment.'
        };

        res.json([detectedDisease]);

    } catch (err) {
        console.error('Error fetching diagnosis from Infermedica:', err.response?.data || err.message);

         // Fallback: Try to match user's symptoms with mockDiseases
        if (symptomIds && Array.isArray(symptomIds)) {
            // Find diseases that have at least one matching symptom
            const matchedDiseases = mockDiseases.filter(disease =>
                disease.commonSymptoms.some(symptom =>
                    symptomIds.map(s => s.toLowerCase()).includes(symptom.toLowerCase())
                )
            );

            if (matchedDiseases.length > 0) {
                return res.json(matchedDiseases);
            }
        }


        res.status(err.response?.status || 500).json({
            message: 'Failed to get diagnosis from external API.',
            details: err.response?.data || err.message
        });
    }
});

module.exports = router;
