const trainerService = require('../services/trainer.service');

class TrainerController {
    async create(req, res) {
        try {
            const trainerData = {
                ...req.body,
                username: req.user.username
            };
            const trainer = await trainerService.create(trainerData);
            res.status(201).json({ data: trainer });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async get(req, res) {
        try {
            const trainer = await trainerService.getByUsername(req.user.username);
            res.json({ data: trainer });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const trainer = await trainerService.update(req.user.username, req.body);
            res.json({ data: trainer });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await trainerService.delete(req.user.username);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async markPokemon(req, res) {
        try {
            const { pokemonId, isCaptured } = req.body;
            const trainer = await trainerService.markPokemon(
                req.user.username,
                pokemonId,
                isCaptured
            );
            res.json({ data: trainer });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new TrainerController();