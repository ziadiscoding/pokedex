import React, { useState, useEffect } from 'react';
import { pokemonService } from '../../services/pokemonService';
import { trainerService } from '../../services/trainerService';
import Navbar from '../partials/Navbar';

const TYPE_COLORS = {
  NORMAL: 'from-gray-500 to-slate-400',
  FIRE: 'from-red-500 to-orange-500',
  WATER: 'from-blue-500 to-blue-400',
  GRASS: 'from-green-500 to-emerald-400',
  ELECTRIC: 'from-yellow-400 to-amber-300',
  ICE: 'from-cyan-400 to-sky-300',
  FIGHTING: 'from-red-700 to-red-600',
  POISON: 'from-purple-600 to-fuchsia-500',
  GROUND: 'from-amber-700 to-yellow-600',
  FLYING: 'from-indigo-400 to-purple-300',
  PSYCHIC: 'from-pink-500 to-rose-400',
  BUG: 'from-lime-500 to-green-400',
  ROCK: 'from-stone-600 to-stone-500',
  GHOST: 'from-purple-800 to-indigo-700',
  DRAGON: 'from-indigo-600 to-purple-600',
  DARK: 'from-gray-800 to-gray-700',
  STEEL: 'from-gray-400 to-slate-400',
  FAIRY: 'from-pink-400 to-rose-300'
};

const TYPE_TRANSLATIONS = {
  NORMAL: 'NORMAL', FIRE: 'FEU', WATER: 'EAU', GRASS: 'PLANTE',
  ELECTRIC: 'ELECTRIK', ICE: 'GLACE', FIGHTING: 'COMBAT',
  POISON: 'POISON', GROUND: 'SOL', FLYING: 'VOL', PSYCHIC: 'PSY',
  BUG: 'INSECTE', ROCK: 'ROCHE', GHOST: 'SPECTRE', DRAGON: 'DRAGON',
  DARK: 'TÉNÈBRES', STEEL: 'ACIER', FAIRY: 'FÉE'
};

const Discover = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const response = await pokemonService.searchPokemons({
          page: 1,
          size: 100
        });
        const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 10);
        setPokemons(shuffled);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading pokemons:', error);
        setIsLoading(false);
      }
    };
    loadPokemons();
  }, []);

  const handleCapture = async () => {
    try {
      await trainerService.markPokemon(pokemons[currentIndex]._id, true);
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } catch (error) {
      console.error('Error capturing pokemon:', error);
    }
  };

  const handleSkip = () => {
    setCurrentIndex(prev => prev + 1);
    setIsRevealed(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-dark flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (currentIndex >= pokemons.length) {
    return (
      <div className="min-h-screen bg-surface-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Découverte Terminée !</h2>
          <p className="text-gray-400 mb-8">Vous avez parcouru tous les Pokémon disponibles</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-accent-purple text-white rounded-xl font-semibold shadow-lg"
          >
            Nouvelle Découverte
          </button>
        </div>
      </div>
    );
  }

  const currentPokemon = pokemons[currentIndex];
  const mainType = currentPokemon.types[0];
  const gradientClass = TYPE_COLORS[mainType] || TYPE_COLORS.NORMAL;

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Découverte</h2>
          <p className="text-gray-400 mt-2">Carte {currentIndex + 1} sur {pokemons.length}</p>
        </div>

        {!isRevealed ? (
          <div 
            onClick={() => setIsRevealed(true)}
            className="w-96 h-128 mx-auto bg-gradient-to-br from-surface-light to-surface rounded-3xl shadow-2xl flex items-center justify-center border border-primary/20 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <span className="text-white text-6xl">?</span>
          </div>
        ) : (
          <div className={`w-96 h-128 mx-auto rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br ${gradientClass}`}>
            <div className="h-full bg-surface/90 backdrop-blur-sm p-6 flex flex-col items-center">
              <img 
                src={currentPokemon.imgUrl}
                alt={currentPokemon.name}
                className="w-48 h-48 object-contain mb-4 drop-shadow-2xl"
              />
              <h3 className="text-2xl font-bold text-white mb-2">{currentPokemon.name}</h3>
              <div className="flex gap-2 mb-4">
                {currentPokemon.types.map(type => (
                  <span 
                    key={type}
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${TYPE_COLORS[type]}`}
                  >
                    {TYPE_TRANSLATIONS[type]}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/80 text-center mb-6">
                {currentPokemon.description}
              </p>
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 bg-surface/80 backdrop-blur-sm border border-primary/20 text-white rounded-xl text-sm font-medium hover:bg-surface transition-all"
                >
                  Passer
                </button>
                <button
                  onClick={handleCapture}
                  className="px-6 py-2 bg-accent-purple/90 backdrop-blur-sm text-white rounded-xl text-sm font-medium shadow-lg shadow-accent-purple/25 hover:bg-accent-purple transition-all"
                >
                  Capturer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;