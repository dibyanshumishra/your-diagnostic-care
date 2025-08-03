const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");

const isLoggedin = async(req, res, next) => {
    const token = req.cookies.token;

    // --- DEBUGGING LINE ---
        // This will show us exactly what the server sees in the cookie.
        console.log('Received token from cookie:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        const decoded = jwt.verify(token, jwtSecret);
        let user = await userModel.findOne({email:decoded.email}).select("-password");
        req.user = user; // Attach user payload (e.g., { id: userId, name, age, sex, email }) to request
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = isLoggedin;
