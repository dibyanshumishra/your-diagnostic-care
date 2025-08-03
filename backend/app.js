require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./middlewares/cors');
require('./config/mongoose');

const app = express();

app.use(cors(corsOptions));

app.use(express.json()); 
app.use(cookieParser()); 


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/symptoms', require('./routes/symptomsRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/diagnose', require('./routes/diagnoseRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));