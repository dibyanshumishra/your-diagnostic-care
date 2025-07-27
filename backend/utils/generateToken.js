const jwt = require("jsonwebtoken");

const generateToken = (user)=> {
    const payload = {
                user: {
                    id: user.id, // Mongoose creates an 'id' getter for '_id'
                    name: user.name,
                    age: user.age,
                    sex: user.sex,
                    email: user.email
                }
    };
    
    // Sign JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    
    jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) {
                console.error('JWT signing error:', err.message);
                return res.status(500).json({ message: 'Token generation failed' });
            }
            res.status(201).json({ token, user: payload.user });
        }
    );
};

module.exports.generateToken = generateToken;