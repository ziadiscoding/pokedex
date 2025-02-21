import React, { useState, useEffect } from 'react';
import { pokemonService } from '../../services/pokemonService';
import { trainerService } from '../../services/trainerService';
import Navbar from '../partials/Navbar';

const TYPE_TRANSLATIONS = {
  NORMAL: 'NORMAL', FIRE: 'FEU', WATER: 'EAU', GRASS: 'PLANTE',
  ELECTRIC: 'ELECTRIK', ICE: 'GLACE', FIGHTING: 'COMBAT',
  POISON: 'POISON', GROUND: 'SOL', FLYING: 'VOL', PSYCHIC: 'PSY',
  BUG: 'INSECTE', ROCK: 'ROCHE', GHOST: 'SPECTRE', DRAGON: 'DRAGON',
  DARK: 'TÉNÈBRES', STEEL: 'ACIER', FAIRY: 'FÉE'
};

const TYPE_COLORS = {
  NORMAL: 'from-gray-500 to-slate-400', FIRE: 'from-red-500 to-orange-500',
  WATER: 'from-blue-500 to-blue-400', GRASS: 'from-green-500 to-emerald-400',
  ELECTRIC: 'from-yellow-400 to-amber-300', ICE: 'from-cyan-400 to-sky-300',
  FIGHTING: 'from-red-700 to-red-600', POISON: 'from-purple-600 to-fuchsia-500',
  GROUND: 'from-amber-700 to-yellow-600', FLYING: 'from-indigo-400 to-purple-300',
  PSYCHIC: 'from-pink-500 to-rose-400', BUG: 'from-lime-500 to-green-400',
  ROCK: 'from-stone-600 to-stone-500', GHOST: 'from-purple-800 to-indigo-700',
  DRAGON: 'from-indigo-600 to-purple-600', DARK: 'from-gray-800 to-gray-700',
  STEEL: 'from-gray-400 to-slate-400', FAIRY: 'from-pink-400 to-rose-300'
};

const FilterButtons = ({ mode, onChange, counts }) => (
  <div className="flex gap-4 z-50">
    <button
      onClick={() => onChange('all')}
      className={`px-6 py-2 rounded-xl font-medium transition-all cursor-pointer z-50 ${
        mode === 'all'
          ? 'bg-accent-purple text-white shadow-lg'
          : 'bg-surface border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/10'
      }`}
    >
      Tous ({counts.all})
    </button>
    <button
      onClick={() => onChange('seen')}
      className={`px-6 py-2 rounded-xl font-medium transition-all cursor-pointer z-50 ${
        mode === 'seen'
          ? 'bg-accent-blue text-white shadow-lg'
          : 'bg-surface border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/10'
      }`}
    >
      Vus ({counts.seen})
    </button>
    <button
      onClick={() => onChange('caught')}
      className={`px-6 py-2 rounded-xl font-medium transition-all cursor-pointer z-50 ${
        mode === 'caught'
          ? 'bg-accent-pink text-white shadow-lg'
          : 'bg-surface border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/10'
      }`}
    >
      Capturés ({counts.caught})
    </button>
  </div>
);

const PokemonCard = ({ pokemon, seenIds, caughtIds }) => {
  const mainType = pokemon.types[0].toUpperCase();
  const typeColor = TYPE_COLORS[mainType] || TYPE_COLORS.NORMAL;

  return (
    <div className="group relative bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-16 bg-gradient-to-r ${typeColor}`} />
      <div className="relative z-10">
        <img
          src={pokemon.imgUrl}
          alt={pokemon.name}
          className="w-24 h-24 mx-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
        />
        <h3 className="text-lg font-bold text-white text-center mt-2">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {pokemon.types.map(type => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${TYPE_COLORS[type.toUpperCase()]}`}
            >
              {TYPE_TRANSLATIONS[type.toUpperCase()]}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {seenIds.includes(pokemon._id) && (
            <span className="bg-surface-dark/80 p-2 rounded-full">👁️</span>
          )}
          {caughtIds.includes(pokemon._id) && (
            <span className="bg-surface-dark/80 p-2 rounded-full">⚾</span>
          )}
        </div>
      </div>
    </div>
  );
};

const MyPokemons = () => {
  const [mode, setMode] = useState('all');
  const [seenPokemons, setSeenPokemons] = useState([]);
  const [caughtPokemons, setCaughtPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await trainerService.getProfile();
        const seen = await Promise.all(
          data.pkmnSeen.map(id => pokemonService.getPokemonById(id))
        );
        const caught = await Promise.all(
          data.pkmnCatch.map(id => pokemonService.getPokemonById(id))
        );
        setSeenPokemons(seen.filter(Boolean));
        setCaughtPokemons(caught.filter(Boolean));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-dark flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const seenIds = seenPokemons.map(p => p._id);
  const caughtIds = caughtPokemons.map(p => p._id);
  const allIds = [...new Set([...seenIds, ...caughtIds])];

  const filteredPokemons = mode === 'seen' ? seenPokemons 
    : mode === 'caught' ? caughtPokemons 
    : allIds.map(id => seenPokemons.find(p => p._id === id) || caughtPokemons.find(p => p._id === id));

  const counts = {
    all: allIds.length,
    seen: seenIds.length,
    caught: caughtIds.length
  };

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <FilterButtons mode={mode} onChange={setMode} counts={counts} />
          {filteredPokemons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Aucun Pokémon trouvé pour ce filtre</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredPokemons.map(pokemon => (
                <PokemonCard 
                  key={pokemon._id}
                  pokemon={pokemon}
                  seenIds={seenIds}
                  caughtIds={caughtIds}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPokemons;