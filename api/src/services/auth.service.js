const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const Trainer = require('../models/trainer.model');

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

const updateUser = async (userId, updateData) => {
    try {
        // Vérifier si l'email ou le username sont déjà pris
        if (updateData.email || updateData.username) {
            const existingUser = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    { email: updateData.email },
                    { username: updateData.username }
                ].filter(condition => condition.email || condition.username)
            });

            if (existingUser) {
                throw new Error('Username or email already exists');
            }
        }

        // Récupérer l'utilisateur actuel pour avoir l'ancien username
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new Error('User not found');
        }

        const oldUsername = currentUser.username;

        // Mettre à jour l'utilisateur
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                currentUser[key] = updateData[key];
            }
        });

        await currentUser.save();

        // Si le username a changé, mettre à jour le profil du dresseur
        if (updateData.username && updateData.username !== oldUsername) {
            const trainer = await Trainer.findOne({ username: oldUsername });
            if (trainer) {
                trainer.username = updateData.username;
                await trainer.save();
            }
        }

        return currentUser;
    } catch (error) {
        // En cas d'erreur lors de la mise à jour du dresseur, 
        // on essaie de restaurer l'ancien username de l'utilisateur
        if (error.message !== 'User not found' && error.message !== 'Username or email already exists') {
            const user = await User.findById(userId);
            if (user && updateData.username) {
                user.username = oldUsername;
                await user.save();
            }
        }
        throw error;
    }
};

module.exports = {
    register,
    login,
    updateUser
};