import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { useAuth } from '../../contexts/AuthContext';

const TYPE_COLORS = {
  FEU: 'bg-gradient-to-r from-red-500 to-orange-500',
  EAU: 'bg-gradient-to-r from-blue-500 to-blue-400',
  PLANTE: 'bg-gradient-to-r from-green-500 to-emerald-400',
  ELECTRIK: 'bg-gradient-to-r from-yellow-400 to-amber-300',
  GLACE: 'bg-gradient-to-r from-cyan-400 to-sky-300',
  COMBAT: 'bg-gradient-to-r from-red-700 to-red-600',
  POISON: 'bg-gradient-to-r from-purple-600 to-fuchsia-500',
  SOL: 'bg-gradient-to-r from-amber-700 to-yellow-600',
  VOL: 'bg-gradient-to-r from-indigo-400 to-purple-300',
  PSY: 'bg-gradient-to-r from-pink-500 to-rose-400',
  INSECTE: 'bg-gradient-to-r from-lime-500 to-green-400',
  ROCHE: 'bg-gradient-to-r from-stone-600 to-stone-500',
  SPECTRE: 'bg-gradient-to-r from-purple-800 to-indigo-700',
  DRAGON: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  TENEBRES: 'bg-gradient-to-r from-gray-800 to-gray-700',
  ACIER: 'bg-gradient-to-r from-gray-400 to-slate-400',
  FEE: 'bg-gradient-to-r from-pink-400 to-rose-300',
  NORMAL: 'bg-gradient-to-r from-gray-500 to-slate-400'
};

const TYPE_TRANSLATIONS = {
  FIRE: 'FEU',
  WATER: 'EAU',
  GRASS: 'PLANTE',
  ELECTRIC: 'ELECTRIK',
  ICE: 'GLACE',
  FIGHTING: 'COMBAT',
  POISON: 'POISON',
  GROUND: 'SOL',
  FLYING: 'VOL',
  PSYCHIC: 'PSY',
  BUG: 'INSECTE',
  ROCK: 'ROCHE',
  GHOST: 'SPECTRE',
  DRAGON: 'DRAGON',
  DARK: 'TENEBRES',
  STEEL: 'ACIER',
  FAIRY: 'FEE',
  NORMAL: 'NORMAL'
};

const PokemonCard = ({
  pokemon,
  isInCollection = false,
  isSeen = false,
  onCaptureSuccess = () => { },
  onRevealSuccess = () => { }
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isCatching, setIsCatching] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [catchStatus, setCatchStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localIsInCollection, setLocalIsInCollection] = useState(isInCollection);
  const [localIsSeen, setLocalIsSeen] = useState(isSeen);

  useEffect(() => {
    if (user) {
      setLocalIsInCollection(isInCollection);
      setLocalIsSeen(isSeen || isInCollection);
    } else {
      setLocalIsInCollection(false);
      setLocalIsSeen(false);
    }
  }, [isInCollection, isSeen, user]);

  const handleCatch = async (e) => {
    e.stopPropagation();
    if (!user || localIsInCollection) return;

    setIsCatching(true);
    try {
      await trainerService.markPokemon(pokemon._id, true);
      setCatchStatus('success');
      setLocalIsInCollection(true);
      setLocalIsSeen(true);
      onCaptureSuccess(pokemon._id);
    } catch (error) {
      setCatchStatus('error');
      setTimeout(() => {
        setCatchStatus(null);
      }, 2000);
    } finally {
      setIsCatching(false);
    }
  };

  const handleReveal = async (e) => {
    e.stopPropagation();
    if (!user || localIsSeen) return;

    setIsRevealing(true);
    try {
      await trainerService.markPokemon(pokemon._id, false);
      setLocalIsSeen(true);
      onRevealSuccess(pokemon._id);
    } catch (error) {
      console.error('Error revealing pokemon:', error);
    } finally {
      setIsRevealing(false);
    }
  };

  const handlePlayCry = (e) => {
    e.stopPropagation();
    if (!pokemon.soundPath || isPlaying) return;

    const audio = new Audio(pokemon.soundPath);
    audio.play()
      .then(() => {
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const mainType = TYPE_TRANSLATIONS[pokemon.types[0]];

  return (
    <div className="relative">
      <div
        onClick={() => setShowModal(true)}
        className="group relative bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-purple/20 overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-16 ${user ? (localIsSeen ? TYPE_COLORS[mainType] : 'bg-gradient-to-r from-gray-600 to-gray-500') : TYPE_COLORS[mainType]}`} />

        <div className="relative z-10">
          {user && (
            <div className="absolute top-2 right-2 flex gap-2">
              {localIsSeen && (
                <span className="bg-surface-dark/80 p-2 rounded-full">
                  👁️
                </span>
              )}
              {localIsInCollection && (
                <span className="bg-surface-dark/80 p-2 rounded-full">
                  ⚾
                </span>
              )}
            </div>
          )}

          <div className="w-full h-40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            <img
              src={pokemon.imgUrl}
              alt={pokemon.name}
              className={`w-32 h-32 object-contain drop-shadow-2xl ${user && !localIsSeen ? 'brightness-0' : ''}`}
            />
          </div>

          <h3 className="text-xl font-bold text-center text-white mb-3">
            {user ? (localIsSeen ? pokemon.name : '???') : pokemon.name}
          </h3>

          <div className="flex flex-wrap justify-center gap-2">
            {user ? (localIsSeen ? pokemon.types.map(type => (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${TYPE_COLORS[TYPE_TRANSLATIONS[type]]}`}
              >
                {TYPE_TRANSLATIONS[type]}
              </span>
            )) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-gray-700">
                ???
              </span>
            )) : pokemon.types.map(type => (
              <span
                key={type}
                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${TYPE_COLORS[TYPE_TRANSLATIONS[type]]}`}
              >
                {TYPE_TRANSLATIONS[type]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-surface-dark/80 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-2xl bg-surface border border-primary/20 rounded-3xl transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className={`absolute top-0 left-0 w-full h-24 ${user ? (localIsSeen ? TYPE_COLORS[mainType] : 'bg-gradient-to-r from-gray-600 to-gray-500') : TYPE_COLORS[mainType]} rounded-t-3xl`} />

            <div className="relative indexscreen p-8">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-dark/80 text-white hover:bg-surface transition-all border border-primary/20 hover:border-primary/40 hover:scale-110"
              >
                ✕
              </button>

              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <img
                    src={pokemon.imgUrl}
                    alt={pokemon.name}
                    className={`w-full h-full object-contain drop-shadow-2xl ${user && !localIsSeen ? 'brightness-0' : ''}`}
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {user ? (localIsSeen ? pokemon.name : '???') : pokemon.name}
                </h2>

                <div className="flex gap-2 mb-6">
                  {user ? (localIsSeen ? pokemon.types.map(type => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${TYPE_COLORS[TYPE_TRANSLATIONS[type]]}`}
                    >
                      {TYPE_TRANSLATIONS[type]}
                    </span>
                  )) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-gray-700">
                      ???
                    </span>
                  )) : pokemon.types.map(type => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${TYPE_COLORS[TYPE_TRANSLATIONS[type]]}`}
                    >
                      {TYPE_TRANSLATIONS[type]}
                    </span>
                  ))}
                </div>

                {(!user || localIsSeen) && (
                  <>
                    <div className="grid grid-cols-2 gap-4 w-full mb-4">
                      <div className="bg-surface-dark/50 p-3 rounded-xl text-center">
                        <span className="text-gray-400 text-sm">Taille</span>
                        <p className="text-white font-semibold">{pokemon.height} m</p>
                      </div>
                      <div className="bg-surface-dark/50 p-3 rounded-xl text-center">
                        <span className="text-gray-400 text-sm">Poids</span>
                        <p className="text-white font-semibold">{pokemon.weight} kg</p>
                      </div>
                    </div>

                    {pokemon.regions && pokemon.regions.length > 0 && (
                      <div className="w-full mb-4">
                        <div className="bg-gradient-to-br from-surface-dark/80 to-surface-dark/40 backdrop-blur-sm p-4 rounded-xl border border-primary/10">
                          <p className="text-gray-300 text-sm mb-3">Régions</p>
                          <div className="flex flex-wrap gap-2">
                            {pokemon.regions.map(region => (
                              <span
                                key={region.regionName}
                                className="px-3 py-1.5 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full text-sm text-white font-medium border border-primary/20 shadow-lg shadow-primary/5"
                              >
                                {region.regionName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-gray-300 text-center mb-6">
                      {pokemon.description}
                    </p>
                  </>
                )}

                <div className="flex gap-4">
                  {user ? (
                    <>
                      {!localIsSeen && (
                        <button
                          onClick={handleReveal}
                          disabled={isRevealing}
                          className={`px-6 py-2 ${TYPE_COLORS[mainType]} text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                          {isRevealing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Dévoilement...
                            </>
                          ) : (
                            'Dévoiler'
                          )}
                        </button>
                      )}

                      {localIsSeen && !localIsInCollection && (
                        <button
                          onClick={handleCatch}
                          disabled={isCatching}
                          className={`px-6 py-2 ${TYPE_COLORS[mainType]} text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                          {isCatching ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Capture en cours...
                            </>
                          ) : catchStatus === 'success' ? (
                            'Capturé !'
                          ) : catchStatus === 'error' ? (
                            'Échec de la capture'
                          ) : (
                            'Capturer'
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <a
                      href="/login"
                      className="px-6 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl font-semibold shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all text-center"
                    >
                      Se connecter pour capturer
                    </a>
                  )}

                  {pokemon.soundPath && (
                    <button
                      onClick={handlePlayCry}
                      disabled={isPlaying}
                      className="px-6 py-2 bg-surface-dark hover:bg-surface-light text-accent-purple border border-accent-purple/30 rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <span className="animate-pulse">🔊</span>
                          Lecture...
                        </>
                      ) : (
                        <>
                          🔈
                          Cri
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;