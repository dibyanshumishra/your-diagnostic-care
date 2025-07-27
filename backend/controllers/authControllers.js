const userModel = require("../models/user-model");
const historyModel = require("../models/history-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.isRegistered =  async (req, res) => {
    const { name, age, sex, email, password } = req.body;

    if (!name || !age || !sex || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (age <= 0 || age > 120) {
        return res.status(400).json({ message: 'Please enter a valid age between 1 and 120.' });
    }
    if (!['male', 'female'].includes(sex)) {
        return res.status(400).json({ message: 'Invalid sex provided. Must be "male" or "female".' });
    }

    try {

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        else {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            age,
            sex,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });
        
        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

        }
    } catch (err) {
        console.error('Server error during registration:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.isLogin = async(req,res) => {
    const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
    
        try {
            let user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const token = generateToken(user);
            res.cookie("token",token);
    
        } catch (err) {
            console.error('Server error during login:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
};
