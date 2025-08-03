const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
    };

    if (user.age) {
        payload.age = user.age;
    }
    if (user.sex) {
        payload.sex = user.sex;
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};