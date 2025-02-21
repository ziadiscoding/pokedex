require('dotenv').config();
const mongoose = require('mongoose');
const { User, ROLES } = require('../models/user.model');

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/pokedex', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminData = {
            username: 'admin',
            email: 'admin@pokemon.com',
            password: 'admin123',
            role: ROLES.ADMIN
        };

        // Vérifier si l'admin existe déjà
        const existingAdmin = await User.findOne({
            $or: [
                { username: adminData.username },
                { email: adminData.email }
            ]
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Créer l'admin
        const admin = new User(adminData);
        await admin.save();

        console.log('Admin user created successfully');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
    }
};

createAdmin();