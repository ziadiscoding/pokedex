import React, { useState } from 'react';

const TYPE_COLORS = {
  NORMAL: 'bg-gradient-to-r from-gray-500 to-slate-400',
  FIRE: 'bg-gradient-to-r from-red-500 to-orange-500',
  WATER: 'bg-gradient-to-r from-blue-500 to-blue-400',
  GRASS: 'bg-gradient-to-r from-green-500 to-emerald-400',
  ELECTRIC: 'bg-gradient-to-r from-yellow-400 to-amber-300',
  ICE: 'bg-gradient-to-r from-cyan-400 to-sky-300',
  FIGHTING: 'bg-gradient-to-r from-red-700 to-red-600',
  POISON: 'bg-gradient-to-r from-purple-600 to-fuchsia-500',
  GROUND: 'bg-gradient-to-r from-amber-700 to-yellow-600',
  FLYING: 'bg-gradient-to-r from-indigo-400 to-purple-300',
  PSYCHIC: 'bg-gradient-to-r from-pink-500 to-rose-400',
  BUG: 'bg-gradient-to-r from-lime-500 to-green-400',
  ROCK: 'bg-gradient-to-r from-stone-600 to-stone-500',
  GHOST: 'bg-gradient-to-r from-purple-800 to-indigo-700',
  DRAGON: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  DARK: 'bg-gradient-to-r from-gray-800 to-gray-700',
  STEEL: 'bg-gradient-to-r from-gray-400 to-slate-400',
  FAIRY: 'bg-gradient-to-r from-pink-400 to-rose-300'
};

const getTypeColor = (type) => {
  if (!type) return TYPE_COLORS.NORMAL;
  const uppercaseType = type.toUpperCase();
  return TYPE_COLORS[uppercaseType] || TYPE_COLORS.NORMAL;
};

const PokemonCollection = ({ seenPokemon = [], caughtPokemon = [] }) => {
  const [displayMode, setDisplayMode] = useState('all');

  const getFilteredPokemon = () => {
    const allPokemon = [...new Map([...seenPokemon, ...caughtPokemon].map(item => [item._id, item])).values()];
    
    switch (displayMode) {
      case 'seen':
        return seenPokemon;
      case 'caught':
        return caughtPokemon;
      default:
        return allPokemon;
    }
  };

  const filteredPokemon = getFilteredPokemon();

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setDisplayMode('all')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            displayMode === 'all'
              ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/25'
              : 'bg-surface border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/10'
          }`}
        >
          All ({filteredPokemon.length})
        </button>
        <button
          onClick={() => setDisplayMode('seen')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            displayMode === 'seen'
              ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25'
              : 'bg-surface border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/10'
          }`}
        >
          Seen ({seenPokemon.length})
        </button>
        <button
          onClick={() => setDisplayMode('caught')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            displayMode === 'caught'
              ? 'bg-accent-pink text-white shadow-lg shadow-accent-pink/25'
              : 'bg-surface border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/10'
          }`}
        >
          Caught ({caughtPokemon.length})
        </button>
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No Pokémon found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredPokemon.map(pokemon => {
            if (!pokemon) return null;
            
            const mainType = pokemon.types && pokemon.types[0];
            
            return (
              <div key={pokemon._id} className="group relative bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-16 ${getTypeColor(mainType)}`} />
                
                <div className="relative z-10">
                  <img
                    src={pokemon.imgUrl}
                    alt={pokemon.name}
                    className="w-24 h-24 mx-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <h3 className="text-lg font-bold text-white text-center mt-2">
                    {pokemon.name}
                  </h3>

                  {pokemon.types && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {pokemon.types.map(type => (
                        <span
                          key={type}
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type).replace('bg-gradient-to-r', '')}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mt-3">
                    {seenPokemon.some(p => p._id === pokemon._id) && (
                      <span className="bg-surface-dark/80 p-2 rounded-full">
                        👁️
                      </span>
                    )}
                    {caughtPokemon.some(p => p._id === pokemon._id) && (
                      <span className="bg-surface-dark/80 p-2 rounded-full">
                        ⚾
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PokemonCollection;