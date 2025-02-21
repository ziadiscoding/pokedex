import React from 'react';
import hero from '../../assets/img/hero.png';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

const HeroSection = () => {
    return (
        <div className="poke-hero">
            <div className="poke-container">
                <div className="poke-titles">
                    <h1 className="poke-title">Partez à </h1>
                    <h1 className="poke-title"> l'Aventure</h1>
                </div>

                <button className="poke-button">
                    découvrir
                </button>

                <div className="poke-relative">
                    <img src={hero} alt="Monde des Pokémon" className="poke-image" />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;