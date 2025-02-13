const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

const register = async (username, email, password) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const user = new User({
        username,
        email,
        password
    });

    await user.save();

    const token = generateToken(user._id);
    return { user, token };
};

const login = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
    }

    const token = generateToken(user._id);
    return { user, token };
};

module.exports = {
    register,
    login
};