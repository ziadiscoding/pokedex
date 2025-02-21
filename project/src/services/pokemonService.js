import api from './api';

export const pokemonService = {
  async searchPokemons({ partialName, typeOne, typeTwo, region, page, size }) {
    console.log('🔍 Service - Paramètres reçus:', { partialName, typeOne, typeTwo, region, page, size });

    const params = {
      page: page || 1,
      size: size || 12
    };

    if (partialName) {
      params.partialName = partialName;
    }

    if (typeOne) {
      params.typeOne = typeOne;
    }

    if (typeTwo) {
      params.typeTwo = typeTwo;
    }

    if (region) {
      params.regionName = region;
      console.log('🌍 Service - Recherche par région:', region);
    }

    console.log('📤 Service - Paramètres finaux envoyés à l\'API:', params);

    const response = await api.get('/pkmn/search', { params });
    console.log('📥 Service - Réponse reçue:', response.data);
    return response.data;
  },

  async getPokemonById(id) {
    const response = await api.get('/pkmn', { params: { id } });
    return response.data.data;
  },

  async getPokemonByName(name) {
    const response = await api.get('/pkmn', { params: { name } });
    return response.data.data;
  },

  async getPokemonTypes() {
    const response = await api.get('/pkmn/types');
    return response.data.data;
  }
};