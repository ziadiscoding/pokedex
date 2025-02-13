const pokemonTypeService = require('../services/pokemon-type.service');

const getTypes = (req, res) => {
    const types = pokemonTypeService.getTypes();
    res.json({
        data: types,
        count: types.length
    });
};

module.exports = {
    getTypes
};