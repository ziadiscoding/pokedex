// import-pokemon.js
const fetch = require('node-fetch');

async function populateDatabase() {
  const POKEMON_COUNT = 1025;
  const API_ENDPOINT = 'http://localhost:3000/api';
  
  try {
    // Login as admin first
    const adminCredentials = {
      username: 'admin',
      password: 'admin123'
    };

    console.log('Logging in as admin...');
    const loginResponse = await fetch(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });

    if (!loginResponse.ok) {
      throw new Error('Failed to login. Make sure your server is running and admin account exists.');
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('Successfully logged in!');

    for (let i = 0; i < POKEMON_COUNT; i++) {
      try {
        const id = i + 1;
        console.log(`Fetching Pokemon ${id}/${POKEMON_COUNT}...`);

        const [pokemonData, speciesData] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => res.json())
        ]);

        const types = pokemonData.types.map(type => type.type.name.toUpperCase());
        const frenchData = {
          name: speciesData.names.find(entry => entry.language.name === 'en')?.name,
          description: speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text
        };

        if (!frenchData.name || !frenchData.description) {
          console.warn(`Missing French data for Pokemon ${id}, skipping...`);
          continue;
        }

        const regions = {
          'red': 'KANTO', 'blue': 'KANTO', 'yellow': 'KANTO',
          'gold': 'JOHTO', 'silver': 'JOHTO', 'crystal': 'JOHTO',
          'ruby': 'HOENN', 'sapphire': 'HOENN', 'emerald': 'HOENN',
          'diamond': 'SINNOH', 'pearl': 'SINNOH', 'platinum': 'SINNOH',
          'black': 'UNOVA', 'white': 'UNOVA',
          'x': 'KALOS', 'y': 'KALOS',
          'sun': 'ALOLA', 'moon': 'ALOLA',
          'sword': 'GALAR', 'shield': 'GALAR',
          'scarlet': 'PALDEA', 'violet': 'PALDEA'
        };

        const regionData = pokemonData.game_indices
          .filter(game => regions[game.version.name])
          .map(game => ({
            regionName: regions[game.version.name],
            regionPokedexNumber: game.game_index
          }));

        const uniqueRegions = regionData.reduce((acc, curr) => {
          if (!acc.some(region => region.regionName === curr.regionName)) {
            acc.push(curr);
          }
          return acc;
        }, []);

        const pokemonPayload = {
          name: frenchData.name,
          types: types,
          description: frenchData.description.replace(/[\n\f]/g, ' '),
          imgUrl: pokemonData.sprites.front_default,
          soundPath: pokemonData.cries?.latest || null,
          height: pokemonData.height / 10,
          weight: pokemonData.weight / 10
        };

        const createPokemonResponse = await fetch(`${API_ENDPOINT}/pkmn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pokemonPayload)
        });

        if (!createPokemonResponse.ok) {
          const errorData = await createPokemonResponse.json();
          console.error(`Error creating Pokemon ${id}:`, errorData);
          continue;
        }

        const createdPokemon = await createPokemonResponse.json();
        
        for (const region of uniqueRegions) {
          await fetch(`${API_ENDPOINT}/pkmn/region?pkmnId=${createdPokemon.data.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(region)
          });
        }

        console.log(`Successfully added Pokemon ${id}: ${frenchData.name}`);
        
        // Petit délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing Pokemon ${i + 1}:`, error);
      }
    }
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Lancer le script
populateDatabase().then(() => console.log('Database population completed'));