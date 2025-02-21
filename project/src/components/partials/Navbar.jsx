import React, { useState } from 'react';
import logo from '../../assets/ico/logo.svg';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <header className="">
            <div className="poke-header px-4 lg:px-24 py-7 relative">
                <div className="poke-container">
                    <Link to="/dashboard">
                        <img src={logo} alt="Logo Pokémon" className="poke-logo h-11" />
                    </Link>
                    <div className="poke-blur"></div>
                </div>
                
                <button 
                    onClick={toggleMenu}
                    className="lg:hidden text-white p-2 focus:outline-none"
                >
                    {isMenuOpen ? (
                        <XMarkIcon className="h-8 w-8" />
                    ) : (
                        <Bars3Icon className="h-8 w-8" />
                    )}
                </button>

                <nav className={`poke-nav absolute lg:relative top-full lg:top-auto
                    left-0 right-0 lg:w-auto
                    transform lg:transform-none transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto'}
                    flex flex-col lg:flex-row items-center
                    bg-surface-dark/95 lg:bg-transparent
                    p-6 lg:p-0
                    border-t border-primary/20 lg:border-none
                    backdrop-blur-md lg:backdrop-blur-none`}
                >
                    <Link to="/dashboard" className="poke-link py-3 lg:py-0" onClick={() => setIsMenuOpen(false)}>
                        Tableau de bord
                    </Link>
                    <Link to="/pokedex" className="poke-link py-3 lg:py-0" onClick={() => setIsMenuOpen(false)}>
                        Pokédex
                    </Link>
                    <Link to="/mypokemons" className="poke-link py-3 lg:py-0" onClick={() => setIsMenuOpen(false)}>
                        Mes Pokémon
                    </Link>
                    <Link to="/trainer/profile" className="poke-link py-3 lg:py-0" onClick={() => setIsMenuOpen(false)}>
                        Dresseur
                    </Link>
                    <Link to="/account" className="poke-link py-3 lg:py-0" onClick={() => setIsMenuOpen(false)}>
                        Mon Compte
                    </Link>
                    <Link to="/discover" className="poke-button mt-4 lg:mt-0 w-full lg:w-auto text-center" onClick={() => setIsMenuOpen(false)}>
                        Découvrir
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;