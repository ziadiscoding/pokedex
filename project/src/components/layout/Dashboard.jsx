import React from 'react';
import Navbar from '../partials/Navbar';
import HeroSection from '../partials/Hero';
import FeaturedPokemons from '../partials/FeaturedPokemons';
import Pokeball3D from '../partials/Pokeball';

const PokemonDashboard = () => {
  return (
    <div className="min-h-screen poke-dashboard">

      <Navbar />
      <HeroSection />

      <div className="poke-flex">
        <Pokeball3D />
        <FeaturedPokemons />
      </div>

    </div>
  );
};

export default PokemonDashboard;  