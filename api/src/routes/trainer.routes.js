const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       required:
 *         - trainerName
 *         - imgUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du dresseur
 *         username:
 *           type: string
 *           description: Username de l'utilisateur lié
 *         trainerName:
 *           type: string
 *           description: Nom du dresseur
 *         imgUrl:
 *           type: string
 *           description: URL de l'image du dresseur
 *         creationDate:
 *           type: string
 *           format: date-time
 *           description: Date de création du dresseur
 *         pkmnSeen:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *           description: Liste des Pokémon vus
 *         pkmnCatch:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *           description: Liste des Pokémon capturés
 */

/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: Gestion des dresseurs Pokémon
 */

/**
 * @swagger
 * /api/trainer:
 *   post:
 *     summary: Crée un nouveau dresseur
 *     description: Crée un nouveau dresseur pour l'utilisateur authentifié
 *     security:
 *       - bearerAuth: []
 *     tags: [Trainer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainerName
 *               - imgUrl
 *             properties:
 *               trainerName:
 *                 type: string
 *                 description: Nom du dresseur
 *               imgUrl:
 *                 type: string
 *                 description: URL de l'image du dresseur
 *     responses:
 *       201:
 *         description: Dresseur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Dresseur déjà existant pour cet utilisateur
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, trainerController.create);

/**
 * @swagger
 * /api/trainer:
 *   get:
 *     summary: Récupère les informations du dresseur
 *     description: Récupère les informations du dresseur de l'utilisateur authentifié
 *     security:
 *       - bearerAuth: []
 *     tags: [Trainer]
 *     responses:
 *       200:
 *         description: Informations du dresseur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trainer'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Dresseur non trouvé
 */
router.get('/', authenticateToken, trainerController.get);

/**
 * @swagger
 * /api/trainer:
 *   put:
 *     summary: Met à jour les informations du dresseur
 *     description: Met à jour les informations du dresseur de l'utilisateur authentifié
 *     security:
 *       - bearerAuth: []
 *     tags: [Trainer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainerName:
 *                 type: string
 *                 description: Nouveau nom du dresseur
 *               imgUrl:
 *                 type: string
 *                 description: Nouvelle URL de l'image du dresseur
 *     responses:
 *       200:
 *         description: Dresseur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trainer'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Dresseur non trouvé
 */
router.put('/', authenticateToken, trainerController.update);

/**
 * @swagger
 * /api/trainer:
 *   delete:
 *     summary: Supprime le dresseur
 *     description: Supprime le dresseur de l'utilisateur authentifié
 *     security:
 *       - bearerAuth: []
 *     tags: [Trainer]
 *     responses:
 *       204:
 *         description: Dresseur supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Dresseur non trouvé
 */
router.delete('/', authenticateToken, trainerController.delete);

/**
 * @swagger
 * /api/trainer/mark:
 *   post:
 *     summary: Marque un Pokémon comme vu ou capturé
 *     description: Ajoute un Pokémon à la liste des Pokémon vus ou capturés du dresseur
 *     security:
 *       - bearerAuth: []
 *     tags: [Trainer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonId
 *               - isCaptured
 *             properties:
 *               pokemonId:
 *                 type: string
 *                 description: ID du Pokémon à marquer
 *               isCaptured:
 *                 type: boolean
 *                 description: true pour capturé, false pour vu
 *     responses:
 *       200:
 *         description: Pokémon marqué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Pokémon invalide ou déjà marqué
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Dresseur ou Pokémon non trouvé
 */
router.post('/mark', authenticateToken, trainerController.markPokemon);

module.exports = router;