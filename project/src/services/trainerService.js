import api from './api';

export const trainerService = {
  async getProfile() {
    const response = await api.get('/trainer');
    return response.data;
  },

  async createProfile(trainerData) {
    const response = await api.post('/trainer', trainerData);
    return response.data;
  },

  async updateProfile(trainerData) {
    const response = await api.put('/trainer', trainerData);
    return response.data;
  },

  async markPokemon(pokemonId, isCaptured) {
    const response = await api.post('/trainer/mark', { pokemonId, isCaptured });
    return response.data;
  }
};