const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon.controller');
const { authenticateToken, checkRole } = require('../middlewares/auth.middleware');
const { ROLES } = require('../models/user.model');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pokemon:
 *       type: object
 *       required:
 *         - name
 *         - types
 *         - description
 *         - imgUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du Pokémon
 *         name:
 *           type: string
 *           description: Nom du Pokémon
 *         types:
 *           type: array
 *           items:
 *             type: string
 *             enum: [NORMAL, FIRE, WATER, ELECTRIC, GRASS, ICE, FIGHTING, POISON, GROUND, FLYING, PSYCHIC, BUG, ROCK, GHOST, DRAGON, DARK, STEEL, FAIRY]
 *         description:
 *           type: string
 *           description: Description du Pokémon
 *         imgUrl:
 *           type: string
 *           description: URL de l'image du Pokémon
 *         regions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               regionName:
 *                 type: string
 *               regionPokedexNumber:
 *                 type: number
 *     Region:
 *       type: object
 *       required:
 *         - regionName
 *         - regionPokedexNumber
 *       properties:
 *         regionName:
 *           type: string
 *         regionPokedexNumber:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Pokemon
 *   description: Gestion des Pokémon
 */

/**
 * @swagger
 * /api/pkmn:
 *   post:
 *     summary: Crée un nouveau Pokémon
 *     security:
 *       - bearerAuth: []
 *     tags: [Pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       201:
 *         description: Pokémon créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Droits insuffisants
 */
router.post('/', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.create);

/**
 * @swagger
 * /api/pkmn/region:
 *   post:
 *     summary: Ajoute une région à un Pokémon
 *     security:
 *       - bearerAuth: []
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: pkmnId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       200:
 *         description: Région ajoutée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Droits insuffisants
 */
router.post('/region', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.addRegion);

/**
 * @swagger
 * /api/pkmn/search:
 *   get:
 *     summary: Recherche des Pokémon
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: partialName
 *         schema:
 *           type: string
 *         description: Partie du nom du Pokémon
 *       - in: query
 *         name: typeOne
 *         schema:
 *           type: string
 *         description: Premier type
 *       - in: query
 *         name: typeTwo
 *         schema:
 *           type: string
 *         description: Second type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des Pokémon trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pokemon'
 *                 count:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/search', pokemonController.search);

/**
 * @swagger
 * /api/pkmn:
 *   get:
 *     summary: Récupère un Pokémon par son ID ou son nom
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID du Pokémon
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nom du Pokémon
 *     responses:
 *       200:
 *         description: Pokémon trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon non trouvé
 */
router.get('/', pokemonController.getOne);

/**
 * @swagger
 * /api/pkmn:
 *   put:
 *     summary: Modifie un Pokémon
 *     security:
 *       - bearerAuth: []
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               imgUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pokémon modifié avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Droits insuffisants
 *       404:
 *         description: Pokémon non trouvé
 */
router.put('/', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.update);

/**
 * @swagger
 * /api/pkmn:
 *   delete:
 *     summary: Supprime un Pokémon
 *     security:
 *       - bearerAuth: []
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pokémon supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Droits insuffisants
 *       404:
 *         description: Pokémon non trouvé
 */
router.delete('/', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.delete);

/**
 * @swagger
 * /api/pkmn/region:
 *   delete:
 *     summary: Supprime une région d'un Pokémon
 *     security:
 *       - bearerAuth: []
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: pkmnId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: regionName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Région supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Droits insuffisants
 *       404:
 *         description: Pokémon ou région non trouvé
 */
router.delete('/region', [authenticateToken, checkRole(ROLES.ADMIN)], pokemonController.removeRegion);

module.exports = router;