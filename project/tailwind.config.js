export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du design
        'primary': {
          dark: '#1A103C',
          DEFAULT: '#2D1B69',
          light: '#392082'
        },
        'accent': {
          purple: '#9D3FFF',
          pink: '#FF3FF2',
          blue: '#3F83FF'
        },
        'surface': {
          dark: '#0F0826',
          DEFAULT: '#170D3A',
          light: '#221453'
        },
        // Couleurs Pokémon existantes
        'pokemon-normal': '#A8A878',
        'pokemon-fire': '#F08030',
        'pokemon-water': '#6890F0',
        'pokemon-electric': '#F8D030',
        'pokemon-grass': '#78C850',
        'pokemon-ice': '#98D8D8',
        'pokemon-fighting': '#C03028',
        'pokemon-poison': '#A040A0',
        'pokemon-ground': '#E0C068',
        'pokemon-flying': '#A890F0',
        'pokemon-psychic': '#F85888',
        'pokemon-bug': '#A8B820',
        'pokemon-rock': '#B8A038',
        'pokemon-ghost': '#705898',
        'pokemon-dragon': '#7038F8',
        'pokemon-dark': '#705848',
        'pokemon-steel': '#B8B8D0',
        'pokemon-fairy': '#EE99AC'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}