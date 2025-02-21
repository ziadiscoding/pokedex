import React, { useState, useEffect } from 'react';
import { pokemonService } from '../../services/pokemonService';
import { trainerService } from '../../services/trainerService';
import PokemonCard from './PokemonCard';
import PokemonSearch from './PokemonSearch';
import Navbar from '../partials/Navbar';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [trainerData, setTrainerData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    partialName: '',
    typeOne: '',
    typeTwo: '',
    region: '',
    size: 12
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 PokemonList - Chargement avec paramètres:', { ...searchParams, page });
      
      const pokemonsResponse = await pokemonService.searchPokemons({
        ...searchParams,
        page
      });

      console.log('📥 PokemonList - Réponse reçue:', pokemonsResponse);
      setPokemons(pokemonsResponse.data);
      setTotalPages(pokemonsResponse.totalPages);

      const trainerResponse = await trainerService.getProfile();
      setTrainerData(trainerResponse.data);
    } catch (error) {
      console.error('❌ PokemonList - Erreur:', error);
      setTrainerData({ pkmnCatch: [], pkmnSeen: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, searchParams]);

  const handleSearch = (params) => {
    console.log('🔍 PokemonList - Nouveaux paramètres de recherche reçus:', params);
    setSearchParams(params);
    setPage(1);
  };

  const handleCaptureSuccess = async (pokemonId) => {
    await loadData();
  };

  if (isLoading || !trainerData) {
    return (
      <div className="min-h-screen bg-surface-dark flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark">
      <Navbar />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <PokemonSearch onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {pokemons.map(pokemon => (
            <PokemonCard 
              key={pokemon._id} 
              pokemon={pokemon}
              isInCollection={trainerData.pkmnCatch.some(p => p._id === pokemon._id)}
              isSeen={trainerData.pkmnSeen.some(p => p._id === pokemon._id)}
              onCaptureSuccess={handleCaptureSuccess}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 rounded-xl bg-surface border border-accent-purple/30 text-accent-purple font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-purple/10 transition-all"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-white">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 rounded-xl bg-surface border border-accent-purple/30 text-accent-purple font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-purple/10 transition-all"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonList;