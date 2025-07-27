const mockDiseases = [
    {
        id: 'common_cold', 
        name: 'Common Cold',
        description: 'A viral infectious disease of the upper respiratory tract that primarily affects the nose. Symptoms include coughing, sore throat, runny nose, sneezing, and fever which usually resolve in seven to ten days.',
        commonSymptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Sneezing', 'Fatigue', 'Headache'],
        riskFactors: ['Weakened immune system', 'Exposure to infected individuals', 'Seasonal changes'],
        basicTreatment: 'Rest, fluids, over-the-counter pain relievers and decongestants. Antibiotics are not effective against viral infections.'
    },
    {
        id: 'influenza',
        name: 'Influenza (Flu)',
        description: 'A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs. It can cause mild to severe illness, and at times can lead to death.',
        commonSymptoms: ['Fever', 'Cough', 'Sore Throat', 'Muscle Ache', 'Fatigue', 'Headache', 'Chills'],
        riskFactors: ['Age (very young/old)', 'Chronic medical conditions', 'Weakened immune system', 'Lack of vaccination'],
        basicTreatment: 'Antiviral drugs (if prescribed early), rest, fluids. Vaccination is key for prevention.'
    },
    {
        id: 'strep_throat',
        name: 'Strep Throat',
        description: 'A bacterial infection that can make your throat feel sore and scratchy. It\'s caused by group A Streptococcus bacteria.',
        commonSymptoms: ['Sore Throat', 'Fever', 'Swollen Glands', 'Headache', 'Nausea', 'Rash (sometimes)'],
        riskFactors: ['Close contact with infected individuals', 'School-aged children'],
        basicTreatment: 'Antibiotics (e.g., penicillin or amoxicillin) to prevent complications. Rest and fluids.'
    },
    {
        id: 'gastroenteritis',
        name: 'Gastroenteritis (Stomach Flu)',
        description: 'An inflammation of the stomach and intestines, typically caused by viral or bacterial infection, leading to vomiting and diarrhea.',
        commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Fever', 'Fatigue'],
        riskFactors: ['Contaminated food or water', 'Close contact with infected individuals', 'Poor hygiene'],
        basicTreatment: 'Rest, rehydration with fluids and electrolytes. Avoid solid foods initially. Antibiotics are rarely needed.'
    },
    {
        id: 'allergy',
        name: 'Allergy',
        description: 'An immune system reaction to a substance that is normally harmless. Symptoms can range from mild to severe and affect various parts of the body.',
        commonSymptoms: ['Runny Nose', 'Sneezing', 'Itchy Eyes', 'Skin Irritation', 'Rash', 'Shortness of Breath (severe cases)'],
        riskFactors: ['Family history of allergies', 'Exposure to allergens (pollen, dust mites, pet dander)'],
        basicTreatment: 'Antihistamines, decongestants, nasal corticosteroids. Avoidance of allergens.'
    },
    {
        id: 'migraine',
        name: 'Migraine',
        description: 'A type of headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It\'s often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.',
        commonSymptoms: ['Headache', 'Nausea', 'Vomiting', 'Sensitivity to Light', 'Sensitivity to Sound', 'Fatigue'],
        riskFactors: ['Genetics', 'Stress', 'Hormonal changes', 'Certain foods or drinks'],
        basicTreatment: 'Pain relievers (NSAIDs, triptans), anti-nausea medication. Lifestyle changes and stress management.'
    },
    {
        id: 'covid_19', 
        name: 'COVID-19',
        description: 'An infectious disease caused by the SARS-CoV-2 virus. It primarily affects the respiratory system but can impact multiple organs.',
        commonSymptoms: ['Fever', 'Cough', 'Fatigue', 'Loss of Smell/Taste', 'Shortness of Breath', 'Muscle Ache', 'Sore Throat', 'Headache', 'Chills'],
        riskFactors: ['Exposure to infected individuals', 'Older age', 'Underlying health conditions', 'Lack of vaccination'],
        basicTreatment: 'Supportive care, antivirals (for eligible patients), oxygen therapy if needed. Vaccination is highly recommended for prevention.'
    }
];

module.exports = {
    mockDiseases,
};