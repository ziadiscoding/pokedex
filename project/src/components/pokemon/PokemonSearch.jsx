import React, { useState, useEffect } from 'react';
import { pokemonService } from '../../services/pokemonService';

const REGIONS = [
  'KANTO', 'JOHTO', 'HOENN', 'SINNOH', 'UNOVA',
  'KALOS', 'ALOLA', 'GALAR', 'PALDEA'
];

const TYPE_TRANSLATIONS = {
  NORMAL: 'NORMAL', FIRE: 'FEU', WATER: 'EAU', GRASS: 'PLANTE',
  ELECTRIC: 'ELECTRIK', ICE: 'GLACE', FIGHTING: 'COMBAT',
  POISON: 'POISON', GROUND: 'SOL', FLYING: 'VOL', PSYCHIC: 'PSY',
  BUG: 'INSECTE', ROCK: 'ROCHE', GHOST: 'SPECTRE', DRAGON: 'DRAGON',
  DARK: 'TÉNÈBRES', STEEL: 'ACIER', FAIRY: 'FÉE'
};

const TYPE_TRANSLATIONS_REVERSE = Object.entries(TYPE_TRANSLATIONS).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const REGION_DISPLAY = {
  'KANTO': 'Kanto',
  'JOHTO': 'Johto',
  'HOENN': 'Hoenn',
  'SINNOH': 'Sinnoh',
  'UNOVA': 'Unova',
  'KALOS': 'Kalos',
  'ALOLA': 'Alola',
  'GALAR': 'Galar',
  'PALDEA': 'Paldea'
};

const PokemonSearch = ({ onSearch }) => {
  const [types, setTypes] = useState([]);
  const [searchParams, setSearchParams] = useState({
    partialName: '',
    typeOne: '',
    typeTwo: '',
    region: ''
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const typesList = await pokemonService.getPokemonTypes();
      console.log('📋 Types chargés:', typesList);
      setTypes(typesList);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des types:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 État actuel des paramètres de recherche:', searchParams);

    const apiParams = {
      ...searchParams,
      typeOne: searchParams.typeOne ? TYPE_TRANSLATIONS_REVERSE[searchParams.typeOne] : '',
      typeTwo: searchParams.typeTwo ? TYPE_TRANSLATIONS_REVERSE[searchParams.typeTwo] : '',
      region: searchParams.region
    };

    console.log('📤 Paramètres envoyés au service:', apiParams);
    onSearch(apiParams);
  };

  const handleReset = () => {
    console.log('🔄 Réinitialisation des paramètres');
    const emptyParams = {
      partialName: '',
      typeOne: '',
      typeTwo: '',
      region: ''
    };
    setSearchParams(emptyParams);
    onSearch(emptyParams);
  };

  const handleTypeOneChange = (e) => {
    const newTypeOne = e.target.value;
    console.log('🎯 Changement de Type 1:', newTypeOne);
    setSearchParams(prev => ({
      ...prev,
      typeOne: newTypeOne,
      typeTwo: newTypeOne === prev.typeTwo ? '' : prev.typeTwo
    }));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-10 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row flex-wrap gap-2">
            <input
              type="text"
              value={searchParams.partialName}
              onChange={(e) => {
                console.log('📝 Saisie du nom:', e.target.value);
                setSearchParams(prev => ({
                  ...prev,
                  partialName: e.target.value
                }));
              }}
              placeholder="Nom..."
              className="flex-1 min-w-32 h-12 px-4 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white placeholder-gray-500 text-sm transition-all"
            />

            <select
              value={searchParams.typeOne}
              onChange={handleTypeOneChange}
              className="flex-1 min-w-32 h-12 px-4 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white text-sm transition-all"
            >
              <option value="">Type 1</option>
              {types.map(type => (
                <option key={type} value={TYPE_TRANSLATIONS[type]} className="bg-surface-dark">
                  {TYPE_TRANSLATIONS[type]}
                </option>
              ))}
            </select>

            <select
              value={searchParams.typeTwo}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('🎯 Changement de Type 2:', newValue);
                setSearchParams(prev => ({
                  ...prev,
                  typeTwo: newValue
                }));
              }}
              disabled={!searchParams.typeOne}
              className="flex-1 min-w-32 h-12 px-4 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
            >
              <option value="">Type 2</option>
              {types.map(type => (
                <option 
                  key={type} 
                  value={TYPE_TRANSLATIONS[type]}
                  disabled={TYPE_TRANSLATIONS[type] === searchParams.typeOne}
                  className="bg-surface-dark"
                >
                  {TYPE_TRANSLATIONS[type]}
                </option>
              ))}
            </select>

            <select
              value={searchParams.region}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('🌍 Sélection de région:', newValue);
                setSearchParams(prev => ({
                  ...prev,
                  region: newValue
                }));
              }}
              className="flex-1 min-w-32 h-12 px-4 rounded-xl border border-primary/20 bg-surface-dark/50 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-white text-sm transition-all"
            >
              <option value="">Région</option>
              {REGIONS.map(region => (
                <option key={region} value={region} className="bg-surface-dark">
                  {REGION_DISPLAY[region]}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="min-w-24 h-12 px-6 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl font-medium text-sm shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-all"
            >
              Rechercher
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-w-24 h-12 px-6 bg-surface border border-accent-purple/30 text-accent-purple rounded-xl font-medium text-sm hover:bg-accent-purple/10 transition-all"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PokemonSearch;