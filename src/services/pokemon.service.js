const Pokemon = require('../models/pokemon.model');

class PokemonService {
    async create(pokemonData) {
        const existingPokemon = await Pokemon.findOne({ name: pokemonData.name });
        if (existingPokemon) {
            throw new Error('Pokemon already exists');
        }
        return await Pokemon.create(pokemonData);
    }

    async addRegion(pokemonId, regionData) {
        const pokemon = await Pokemon.findById(pokemonId);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }

        const existingRegionIndex = pokemon.regions.findIndex(
            r => r.regionName === regionData.regionName
        );

        if (existingRegionIndex !== -1) {
            pokemon.regions[existingRegionIndex].regionPokedexNumber = regionData.regionPokedexNumber;
        } else {
            pokemon.regions.push(regionData);
        }

        return await pokemon.save();
    }

    async search(filters = {}, pagination = {}) {
        const { partialName, typeOne, typeTwo } = filters;
        const { page = 1, size = 20 } = pagination;

        const query = {};

        if (partialName) {
            query.name = new RegExp(partialName, 'i');
        }

        if (typeOne || typeTwo) {
            query.types = { $all: [typeOne, typeTwo].filter(Boolean) };
        }

        const total = await Pokemon.countDocuments(query);
        const pokemons = await Pokemon.find(query)
            .skip((page - 1) * size)
            .limit(size);

        return {
            data: pokemons,
            count: total,
            page: parseInt(page),
            totalPages: Math.ceil(total / size)
        };
    }

    async getById(id) {
        const pokemon = await Pokemon.findById(id);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }
        return pokemon;
    }

    async getByName(name) {
        const pokemon = await Pokemon.findOne({ name });
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }
        return pokemon;
    }

    async update(id, updateData) {
        const pokemon = await Pokemon.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!pokemon) {
            throw new Error('Pokemon not found');
        }
        return pokemon;
    }

    async delete(id) {
        const pokemon = await Pokemon.findByIdAndDelete(id);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }
        return pokemon;
    }

    async removeRegion(pokemonId, regionName) {
        const pokemon = await Pokemon.findById(pokemonId);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }

        pokemon.regions = pokemon.regions.filter(
            region => region.regionName !== regionName
        );

        return await pokemon.save();
    }
}

module.exports = new PokemonService();