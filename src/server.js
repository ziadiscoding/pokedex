const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ne connecte MongoDB que si nous ne sommes pas en mode test
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost:27017/pokedex').then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(swaggerSpec));

// Préfixe global pour toutes les routes de l'API
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Import des controllers
const pokemonTypeController = require('./controllers/pokemon-type.controller');
const authController = require('./controllers/auth.controller');
const pokemonController = require('./controllers/pokemon.controller');
const trainerController = require('./controllers/trainer.controller');

// Import des middlewares
const { authenticateToken, checkRole } = require('./middlewares/auth.middleware');
const { ROLES } = require('./models/user.model');

// Routes d'authentification
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.get('/auth/me', authenticateToken, authController.checkUser);

// Routes des types de Pokémon
apiRouter.get('/pkmn/types', pokemonTypeController.getTypes);

// Routes des Pokémon
apiRouter.post('/pkmn', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.create);
apiRouter.post('/pkmn/region', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.addRegion);
apiRouter.get('/pkmn/search', pokemonController.search);
apiRouter.get('/pkmn', pokemonController.getOne);
apiRouter.put('/pkmn', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.update);
apiRouter.delete('/pkmn', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.delete);
apiRouter.delete('/pkmn/region', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.removeRegion);

// Routes des Dresseurs
apiRouter.post('/trainer', authenticateToken, trainerController.create);
apiRouter.get('/trainer', authenticateToken, trainerController.get);
apiRouter.put('/trainer', authenticateToken, trainerController.update);
apiRouter.delete('/trainer', authenticateToken, trainerController.delete);
apiRouter.post('/trainer/mark', authenticateToken, trainerController.markPokemon);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Route pour gérer les routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        message: 'Route non trouvée'
    });
});

// Export de l'app pour les tests
module.exports = app;

// Démarrage du serveur seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
    });
}