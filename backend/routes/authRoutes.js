const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const { isRegistered, isLogin, verifyUser, logout } = require('../controllers/authControllers');
const authMiddleware = require('../middlewares/isLoggedin');

//POST--> /api/auth/register
router.post('/register', isRegistered);

//POST--> /api/auth/login
router.post('/login', isLogin);

// @desc    Verify user token from cookie and return user data
router.get('/verify', authMiddleware, verifyUser);

router.post('/logout', logout);

module.exports = router;