const express = require('express');
const app = express();
require('dotenv').config(); 
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
const diagnoseRoutes = require('./routes/diagnoseRoutes');
const historyRoutes = require('./routes/historyRoutes');

const corsOptions = require('./middlewares/cors');
app.use(cors(corsOptions));