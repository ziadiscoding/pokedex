import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { pokemonService } from '../../services/pokemonService';

const FeaturedPokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserPokemons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await trainerService.getProfile();
        const trainerData = response.data;

        if (!trainerData.pkmnCatch) {
          throw new Error('Invalid trainer data structure');
        }

        const caughtPokemonIds = trainerData.pkmnCatch.slice(0, 3);
        const pokemonDetailsPromises = caughtPokemonIds.map(async (pokemon) => {
          const detail = await pokemonService.getPokemonById(pokemon._id);
          return detail;
        });

        const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        const validPokemons = pokemonDetails.filter(pokemon => pokemon && pokemon._id);
        setPokemons(validPokemons);

      } catch (err) {
        setError(err.message || 'Failed to load Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    loadUserPokemons();
  }, []);

  if (loading) {
    return (
      <div className="poke-featured">
        <h2 className="poke-title">Mes Pokémon</h2>
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poke-featured">
        <h2 className="poke-title">Mes Pokémon</h2>
        <div className="text-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="poke-featured">
        <h2 className="poke-title">Mes Pokémon</h2>
        <div className="text-center text-gray-400">
          Pas encore de Pokémon capturé. Commencez votre aventure!
        </div>
      </div>
    );
  }

  return (
    <div className="poke-featured">
      <h2 className="poke-title">Mes Pokémon</h2>
      <div className="mypokemons">
        {pokemons.map((pokemon) => (
          <div key={pokemon._id} className="single-pokemon">
            <div className="relative">
              <span className="poke-image">              <img
                src={pokemon.imgUrl}
                alt={pokemon.name}
              /></span>
            </div>
            <div className="poke-details">
              <h3 className="poke-name">{pokemon.name}</h3>
              <span className="poke-type">{pokemon.types[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPokemons;