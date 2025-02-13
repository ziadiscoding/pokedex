const pokemonService = require('../../../services/pokemon.service');
const Pokemon = require('../../../models/pokemon.model');

describe('Pokemon Service Test', () => {
  const mockPokemon = {
    name: 'Charizard',
    types: ['FIRE', 'FLYING'],
    description: 'A fierce dragon-like Pokemon',
    imgUrl: 'https://example.com/charizard.png'
  };

  describe('create', () => {
    it('should create a new pokemon', async () => {
      const pokemon = await pokemonService.create(mockPokemon);

      expect(pokemon.name).toBe(mockPokemon.name);
      expect(pokemon.types).toEqual(expect.arrayContaining(mockPokemon.types));
    });

    it('should not create duplicate pokemon', async () => {
      await pokemonService.create(mockPokemon);

      await expect(pokemonService.create(mockPokemon))
        .rejects
        .toThrow('Pokemon already exists');
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await Pokemon.create([
        mockPokemon,
        {
          name: 'Blastoise',
          types: ['WATER'],
          description: 'A powerful water turtle',
          imgUrl: 'https://example.com/blastoise.png'
        }
      ]);
    });

    it('should find pokemon by partial name', async () => {
      const result = await pokemonService.search({ partialName: 'char' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Charizard');
    });

    it('should find pokemon by type', async () => {
      const result = await pokemonService.search({ typeOne: 'FIRE' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].types).toContain('FIRE');
    });

    it('should handle pagination', async () => {
      const result = await pokemonService.search({}, { page: 1, size: 1 });

      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(2);
    });
  });
});