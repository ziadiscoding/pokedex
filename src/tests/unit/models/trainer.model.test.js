const Trainer = require('../../../models/trainer.model');
const Pokemon = require('../../../models/pokemon.model');
const mongoose = require('mongoose');

describe('Trainer Model Test', () => {
    let validTrainerData;
    let testPokemon1;
    let testPokemon2;

    beforeEach(async () => {
        validTrainerData = {
            username: 'testuser',
            trainerName: 'Ash Ketchum',
            imgUrl: 'https://example.com/ash.png'
        };

        testPokemon1 = await Pokemon.create({
            name: 'Pikachu',
            types: ['ELECTRIC'],
            description: 'Electric mouse Pokemon',
            imgUrl: 'https://example.com/pikachu.png'
        });

        testPokemon2 = await Pokemon.create({
            name: 'Charizard',
            types: ['FIRE', 'FLYING'],
            description: 'Fire dragon Pokemon',
            imgUrl: 'https://example.com/charizard.png'
        });
    });

    it('should handle invalid pokemon references gracefully', async () => {
        const trainer = new Trainer(validTrainerData);
        const invalidId = new mongoose.Types.ObjectId();
        trainer.pkmnSeen = [invalidId];
        await trainer.save();

        const savedTrainer = await Trainer.findOne({ username: trainer.username });
        expect(savedTrainer.pkmnSeen).toHaveLength(1);

        const populatedTrainer = await Trainer.findOne({ username: trainer.username })
            .populate('pkmnSeen');
        expect(populatedTrainer.pkmnSeen).toHaveLength(0);
    });

    it('should remove pokemon references when pokemon is deleted', async () => {
        const trainer = new Trainer(validTrainerData);
        trainer.pkmnSeen = [testPokemon1._id];
        await trainer.save();

        const beforeDelete = await Trainer.findOne({ username: trainer.username })
            .populate('pkmnSeen');
        expect(beforeDelete.pkmnSeen).toHaveLength(1);
        expect(beforeDelete.pkmnSeen[0].name).toBe('Pikachu');

        await Pokemon.findByIdAndDelete(testPokemon1._id);

        const afterDelete = await Trainer.findOne({ username: trainer.username })
            .populate('pkmnSeen');
        expect(afterDelete.pkmnSeen).toHaveLength(0);
    });
});