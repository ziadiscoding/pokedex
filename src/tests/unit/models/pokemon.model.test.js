const Pokemon = require('../../../models/pokemon.model');

describe('Pokemon Model Test', () => {
  const validPokemonData = {
    name: 'Pikachu',
    types: ['ELECTRIC'],
    description: 'A cute electric mouse',
    imgUrl: 'https://example.com/pikachu.png',
    regions: [{
      regionName: 'Kanto',
      regionPokedexNumber: 25
    }]
  };

  it('should validate a valid pokemon', async () => {
    const validPokemon = new Pokemon(validPokemonData);
    const savedPokemon = await validPokemon.save();

    expect(savedPokemon._id).toBeDefined();
    expect(savedPokemon.name).toBe(validPokemonData.name);
    expect(savedPokemon.types).toEqual(expect.arrayContaining(validPokemonData.types));
  });

  it('should fail validation without required name', async () => {
    const pokemonWithoutName = new Pokemon({
      ...validPokemonData,
      name: undefined
    });

    let err;
    try {
      await pokemonWithoutName.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it('should fail validation with invalid type', async () => {
    const pokemonWithInvalidType = new Pokemon({
      ...validPokemonData,
      types: ['INVALID_TYPE']
    });

    let err;
    try {
      await pokemonWithInvalidType.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors['types.0']).toBeDefined();
  });

  it('should fail validation with more than 2 types', async () => {
    const pokemonWithTooManyTypes = new Pokemon({
      ...validPokemonData,
      types: ['FIRE', 'WATER', 'GRASS']
    });

    let err;
    try {
      await pokemonWithTooManyTypes.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});