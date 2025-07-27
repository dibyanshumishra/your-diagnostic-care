const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const { isRegistered, isLogin } = require('../controllers/authControllers');

//POST--> /api/auth/register
router.post('/register', isRegistered);

//POST--> /api/auth/login
router.post('/login', isLogin);

module.exports = router;