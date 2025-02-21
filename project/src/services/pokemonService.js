import api from './api';

export const pokemonService = {
  async searchPokemons({ partialName, typeOne, typeTwo, region, page, size }) {
    const params = {
      ...(partialName && { partialName }),
      ...(typeOne && { typeOne }),
      ...(typeTwo && { typeTwo }),
      ...(region && { region }),
      page: page || 1,
      size: size || 12
    };

    const response = await api.get('/pkmn/search', { params });
    return response.data;
  },

  async getPokemonTypes() {
    const response = await api.get('/pkmn/types');
    return response.data.data;
  },

  async getPokemonById(id) {
    const response = await api.get('/pkmn', { params: { id } });
    return response.data.data;
  },

  async getPokemonByName(name) {
    const response = await api.get('/pkmn', { params: { name } });
    return response.data.data;
  }
};