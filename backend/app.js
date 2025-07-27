const express = require('express');
const app = express();
require('dotenv').config(); 
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const cookieparser = require('cookie-parser');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname,"public")));

const corsOptions = require('./middlewares/cors');
app.use(cors(corsOptions));

const authRoutes = require('./routes/authRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
const diagnoseRoutes = require('./routes/diagnoseRoutes');
const historyRoutes = require('./routes/historyRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/diagnose', diagnoseRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
    res.send('Symptom Checker Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});