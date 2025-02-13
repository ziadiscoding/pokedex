const trainerService = require('../../../services/trainer.service');
const Pokemon = require('../../../models/pokemon.model');
const Trainer = require('../../../models/trainer.model');

describe('Trainer Service Test', () => {
  const testTrainer = {
    username: 'testuser',
    trainerName: 'Ash Ketchum',
    imgUrl: 'https://example.com/ash.png'
  };

  let testPokemon;

  beforeEach(async () => {
    testPokemon = await Pokemon.create({
      name: 'Pikachu',
      types: ['ELECTRIC'],
      description: 'Electric mouse Pokemon',
      imgUrl: 'https://example.com/pikachu.png'
    });
  });

  describe('create', () => {
    it('should create a new trainer', async () => {
      const trainer = await trainerService.create(testTrainer);

      expect(trainer.username).toBe(testTrainer.username);
      expect(trainer.trainerName).toBe(testTrainer.trainerName);
      expect(trainer.imgUrl).toBe(testTrainer.imgUrl);
    });

    it('should not create duplicate trainer for username', async () => {
      await trainerService.create(testTrainer);

      await expect(
        trainerService.create(testTrainer)
      ).rejects.toThrow('Trainer already exists for this user');
    });
  });

  describe('getByUsername', () => {
    beforeEach(async () => {
      await trainerService.create(testTrainer);
    });

    it('should get trainer by username', async () => {
      const trainer = await trainerService.getByUsername(testTrainer.username);

      expect(trainer.trainerName).toBe(testTrainer.trainerName);
    });

    it('should throw error for non-existent username', async () => {
      await expect(
        trainerService.getByUsername('nonexistent')
      ).rejects.toThrow('Trainer not found');
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await trainerService.create(testTrainer);
    });

    it('should update trainer', async () => {
      const updatedData = {
        trainerName: 'Gary Oak',
        imgUrl: 'https://example.com/gary.png'
      };

      const trainer = await trainerService.update(testTrainer.username, updatedData);

      expect(trainer.trainerName).toBe(updatedData.trainerName);
      expect(trainer.imgUrl).toBe(updatedData.imgUrl);
    });

    it('should throw error for non-existent username', async () => {
      await expect(
        trainerService.update('nonexistent', { trainerName: 'New Name' })
      ).rejects.toThrow('Trainer not found');
    });
  });

  describe('markPokemon', () => {
    beforeEach(async () => {
      await trainerService.create(testTrainer);
    });

    it('should mark pokemon as seen', async () => {
      const trainer = await trainerService.markPokemon(
        testTrainer.username,
        testPokemon._id,
        false
      );

      expect(trainer.pkmnSeen).toContainEqual(testPokemon._id);
    });

    it('should mark pokemon as caught', async () => {
      const trainer = await trainerService.markPokemon(
        testTrainer.username,
        testPokemon._id,
        true
      );

      expect(trainer.pkmnCatch).toContainEqual(testPokemon._id);
    });

    it('should move pokemon from seen to caught', async () => {
      await trainerService.markPokemon(testTrainer.username, testPokemon._id, false);
      const trainer = await trainerService.markPokemon(
        testTrainer.username,
        testPokemon._id,
        true
      );

      expect(trainer.pkmnCatch).toContainEqual(testPokemon._id);
      expect(trainer.pkmnSeen).not.toContainEqual(testPokemon._id);
    });

    it('should not duplicate pokemon in lists', async () => {
      const trainer = await trainerService.markPokemon(
        testTrainer.username,
        testPokemon._id,
        true
      );

      await trainerService.markPokemon(testTrainer.username, testPokemon._id, true);

      expect(trainer.pkmnCatch.filter(id => id.equals(testPokemon._id))).toHaveLength(1);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await trainerService.create(testTrainer);
    });

    it('should delete trainer', async () => {
      await trainerService.delete(testTrainer.username);

      const trainer = await Trainer.findOne({ username: testTrainer.username });
      expect(trainer).toBeNull();
    });

    it('should throw error for non-existent username', async () => {
      await expect(
        trainerService.delete('nonexistent')
      ).rejects.toThrow('Trainer not found');
    });
  });
});