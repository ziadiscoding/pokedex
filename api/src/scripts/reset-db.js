// src/scripts/reset-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const { User, ROLES } = require('../models/user.model');
const Pokemon = require('../models/pokemon.model');
const Trainer = require('../models/trainer.model');

const resetDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/pokedex', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected successfully');

        // Supprimer toutes les collections
        console.log('Dropping all collections...');
        await Promise.all([
            User.deleteMany({}),
            Pokemon.deleteMany({}),
            Trainer.deleteMany({})
        ]);
        console.log('All collections dropped successfully');

        // Recréer le compte admin
        console.log('Creating admin account...');
        const adminData = {
            username: 'admin',
            email: 'admin@pokemon.com',
            password: 'admin123',
            role: ROLES.ADMIN
        };

        const admin = new User(adminData);
        await admin.save();
        console.log('Admin account created:');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);

        console.log('\nDatabase reset complete!');
        console.log('\nYou can now run the Pokemon import script:');
        console.log('node src/scripts/import-from-api.js');

    } catch (error) {
        console.error('Error during database reset:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Exécuter le script si lancé directement
if (require.main === module) {
    resetDatabase()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = resetDatabase;