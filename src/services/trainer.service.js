const Trainer = require('../models/trainer.model');
const Pokemon = require('../models/pokemon.model');

class TrainerService {
    async create(trainerData) {
        const existingTrainer = await Trainer.findOne({ username: trainerData.username });
        if (existingTrainer) {
            throw new Error('Trainer already exists for this user');
        }
        return await Trainer.create(trainerData);
    }

    async getByUsername(username) {
        const trainer = await Trainer.findOne({ username })
            .populate('pkmnSeen')
            .populate('pkmnCatch');
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        return trainer;
    }

    async update(username, updateData) {
        const trainer = await Trainer.findOneAndUpdate(
            { username },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        return trainer;
    }

    async delete(username) {
        const trainer = await Trainer.findOneAndDelete({ username });
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        return trainer;
    }

    async markPokemon(username, pokemonId, isCaptured) {
        const trainer = await Trainer.findOne({ username });
        if (!trainer) {
            throw new Error('Trainer not found');
        }

        const pokemon = await Pokemon.findById(pokemonId);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }

        const listToUpdate = isCaptured ? 'pkmnCatch' : 'pkmnSeen';
        const otherList = isCaptured ? 'pkmnSeen' : 'pkmnCatch';

        if (!trainer[listToUpdate].includes(pokemonId)) {
            trainer[listToUpdate].push(pokemonId);
        }

        if (isCaptured && trainer[otherList].includes(pokemonId)) {
            trainer[otherList] = trainer[otherList].filter(
                id => id.toString() !== pokemonId.toString()
            );
        }

        return await trainer.save();
    }
}

module.exports = new TrainerService();