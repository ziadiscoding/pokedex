const pokemonService = require('../services/pokemon.service');

class PokemonController {
    async create(req, res) {
        try {
            const pokemon = await pokemonService.create(req.body);
            res.status(201).json({ data: pokemon });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async addRegion(req, res) {
        try {
            const { pkmnId } = req.query;
            const { regionName, regionPokedexNumber } = req.body;

            const pokemon = await pokemonService.addRegion(pkmnId, {
                regionName,
                regionPokedexNumber: parseInt(regionPokedexNumber)
            });

            res.json({ data: pokemon });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async search(req, res) {
        try {
            const { page, size, partialName, typeOne, typeTwo } = req.query;

            const result = await pokemonService.search(
                { partialName, typeOne, typeTwo },
                { page, size }
            );

            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const { id, name } = req.query;
            let pokemon;

            if (id) {
                pokemon = await pokemonService.getById(id);
            } else if (name) {
                pokemon = await pokemonService.getByName(name);
            } else {
                return res.status(400).json({ message: 'ID or name is required' });
            }

            res.json({ data: pokemon });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.query;
            const pokemon = await pokemonService.update(id, req.body);
            res.json({ data: pokemon });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.query;
            await pokemonService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async removeRegion(req, res) {
        try {
            const { pkmnId, regionName } = req.query;
            await pokemonService.removeRegion(pkmnId, regionName);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new PokemonController();